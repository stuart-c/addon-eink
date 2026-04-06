# Stage 1: Build stage
ARG BUILD_FROM
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


# Stage 2: Lint stage
FROM builder AS linter

# Install linting tools
RUN \
    pip3 install --no-cache-dir \
        black==26.3.1 \
        flake8==7.3.0

COPY app /app

# Run linting; the build will fail if linting fails
RUN \
    black --check /app && \
    flake8 /app


# Stage 3: Runner stage (Final)
ARG BUILD_FROM
FROM $BUILD_FROM

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
