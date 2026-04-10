FROM mcr.microsoft.com/devcontainers/python:3.12-bookworm

# Install additional OS packages and tools
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        libjpeg-dev \
        zlib1g-dev \
        build-essential \
        openssh-server \
        curl \
        gnupg \
        sudo

# Install Node.js 22
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt update \
    && apt install gh -y

# Configure SSH
RUN mkdir /var/run/sshd \
    && sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config \
    && sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config \
    && sed -i 's/#AuthorizedKeysFile/AuthorizedKeysFile/' /etc/ssh/sshd_config \
    && mkdir -p /home/vscode/.ssh \
    && chown vscode:vscode /home/vscode/.ssh

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

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
