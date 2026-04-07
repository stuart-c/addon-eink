FROM mcr.microsoft.com/devcontainers/python:3.12-bookworm

# Install additional OS packages
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        libjpeg-dev \
        zlib1g-dev \
        build-essential

# Set up the workspace
WORKDIR /workspaces/addon-eink

# Copy requirements files to pre-install dependencies
COPY eink_layout_manager/app/requirements.txt /tmp/pip-tmp/
COPY eink_layout_manager/app/requirements_test.txt /tmp/pip-tmp/

# Install dependencies
RUN pip3 --disable-pip-version-check --no-cache-dir install \
    -r /tmp/pip-tmp/requirements.txt \
    -r /tmp/pip-tmp/requirements_test.txt \
    && rm -rf /tmp/pip-tmp

# Set PYTHONPATH to include the eink_layout_manager directory
ENV PYTHONPATH="/workspaces/addon-eink/eink_layout_manager"
