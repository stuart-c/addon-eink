ARG BUILD_FROM="ghcr.io/home-assistant/amd64-base-python:3.12-alpine3.19"

# Stage 0: Node.js Frontend Build
FROM node:20-alpine AS node-builder
WORKDIR /build
COPY app/static /build/
RUN npm install && npm run build

# Stage 1: Build stage
FROM $BUILD_FROM AS builder

# Install build dependencies
RUN \
    apk add --no-cache \
        build-base \
        libjpeg-turbo-dev \
        zlib-dev

# Build wheels for app dependencies to isolate build artifacts
COPY app/requirements.txt /tmp/
RUN \
    pip3 wheel --no-cache-dir --wheel-dir /tmp/wheels -r /tmp/requirements.txt


# Stage 2: Test & Lint stage
FROM builder AS tester

# Install test and linting dependencies
COPY app/requirements_test.txt /tmp/
RUN \
    pip3 install --no-cache-dir -r /tmp/requirements_test.txt

COPY app /app

# Run all quality checks; the build will fail if any fail
RUN \
    black --check --line-length 79 /app && \
    flake8 /app && \
    PYTHONPATH=/ pytest /app/tests/


# Stage 3: Runner stage (Final)
FROM $BUILD_FROM AS runner
# Ensure the build fails if the tester stage fails
COPY --from=tester /app /app_verified
RUN rm -rf /app_verified

# Install runtime libraries only (no headers or build tools)
RUN \
    apk add --no-cache \
        libjpeg-turbo \
        zlib

# Install pre-built wheels from builder stage
COPY --from=builder /tmp/wheels /tmp/wheels
RUN \
    pip3 install --no-cache-dir /tmp/wheels/* \
    && rm -rf /tmp/wheels

# Copy root filesystem
COPY rootfs /

# Copy application
COPY app /app

# Copy built frontend assets from node-builder
COPY --from=node-builder /build/static_dist /app/static_dist

# Cleanup development/test files to keep image small
RUN rm -rf /app/tests /app/requirements_test.txt

WORKDIR /app

# Give execution permissions to s6 run scripts
RUN chmod a+x /etc/services.d/app/run

# Labels
LABEL \
    io.hass.name="eInk Layout Manager" \
    io.hass.description="Manage multiple eInk displays with advanced layouts via OpenDisplay" \
    io.hass.type="addon"
