ARG BUILD_FROM="ghcr.io/home-assistant/base-python:3.13-alpine3.23"

# Stage 0: Node.js Frontend Build
FROM node:24.15-alpine AS node-builder
WORKDIR /frontend
COPY frontend .
RUN npm install && npm run build

# Stage 1: Build stage
FROM $BUILD_FROM AS builder

# Install build dependencies
RUN \
    apk add --no-cache \
        build-base \
        libjpeg-turbo-dev \
        zlib-dev \
        nodejs \
        npm \
        pixman-dev \
        cairo-dev \
        pango-dev \
        giflib-dev \
        librsvg-dev

# Build wheels for backend dependencies to isolate build artifacts
COPY backend/requirements.txt /tmp/
RUN \
    pip3 wheel --no-cache-dir --wheel-dir /tmp/wheels -r /tmp/requirements.txt

# Install converter dependencies
WORKDIR /converter
COPY epdoptimize /epdoptimize
COPY converter/package.json converter/package-lock.json* ./
RUN npm install
COPY converter .

# Stage 2: Test & Lint stage
FROM builder AS tester

# Install test and linting dependencies
COPY backend/requirements_test.txt /tmp/
RUN \
    pip3 install --no-cache-dir -r /tmp/requirements_test.txt

COPY backend /backend

# Run all quality checks; the build will fail if any fail
RUN \
    PYTHONPATH=/ pytest /backend/tests/

# Stage 3: Runner stage (Final)
FROM $BUILD_FROM AS runner
ENV PYTHONUNBUFFERED=1
# Ensure the build fails if the tester stage fails
COPY --from=tester /backend /backend_verified
RUN rm -rf /backend_verified

# Install runtime libraries only (no headers or build tools)
RUN \
    apk add --no-cache \
        libjpeg-turbo \
        zlib \
        nodejs \
        pixman \
        cairo \
        pango \
        giflib \
        librsvg

# Install pre-built wheels from builder stage
COPY --from=builder /tmp/wheels /tmp/wheels
RUN \
    pip3 install --no-cache-dir /tmp/wheels/* \
    && rm -rf /tmp/wheels

# Copy root filesystem
COPY rootfs /

# Copy application
COPY backend /backend

# Copy built converter from builder
COPY --from=builder /converter /converter

# Copy built frontend assets from node-builder
COPY --from=node-builder /frontend/dist /backend/static_dist

# Cleanup development/test files to keep image small
RUN rm -rf /backend/tests /backend/requirements_test.txt

WORKDIR /backend

# Create non-root user
RUN addgroup -g 1000 addon && \
    adduser -u 1000 -G addon -S -D addon

# Give execution permissions to s6 run scripts and set ownership for /backend
RUN chmod a+x /etc/services.d/app/run && \
    chown -R addon:addon /backend

# Labels
LABEL \
    io.hass.name="eInk Layout Manager" \
    io.hass.description="Manage multiple eInk displays with advanced layouts via OpenDisplay" \
    io.hass.type="addon"
