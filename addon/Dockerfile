ARG BUILD_FROM
FROM $BUILD_FROM

# Install requirements for Python processing
RUN \
    apk add --no-cache \
    nginx \
    libjpeg-turbo-dev \
    zlib-dev

# Copy Python requirements file
COPY app/requirements.txt /tmp/

# Install python dependencies
RUN \
    pip3 install --no-cache-dir -r /tmp/requirements.txt

# Copy root filesystem
COPY rootfs /

# Copy application
COPY app /app

WORKDIR /app

# Give execution permissions to s6 run scripts
RUN chmod a+x /etc/services.d/app/run

# Labels
LABEL \
    io.hass.name="eInk Layout Manager" \
    io.hass.description="Manage multiple eInk displays with advanced layouts via OpenDisplay" \
    io.hass.type="addon"
