
## Local setup

```sh
mv .env.example .env

npm i
```

Obtain API ID and API hash on [my.telegram.org](https://my.telegram.org) and populate the `.env` file.

## Dev mode

```sh
npm run dev
```

### Invoking API from console

Start your dev server and locate GramJS worker in console context.

All constructors and functions available in global `GramJs` variable.

Run `npm run gramjs:tl full` to get access to all available Telegram requests.

Example usage:
``` javascript
await invoke(new GramJs.help.GetAppConfig())
```

## Bug reports and Suggestions
If you find an issue with this app, let Telegram know using the [Suggestions Platform](https://bugs.telegram.org/c/4002).
# Build
You can use the installation with a docker container or use the Ansible role
## Build docker 
Put your certificate(cert.crt) and key(cert.key) to the root of the repository

Build docker image:
```sh
docker build . -t proxytg
```
Run docker container:
```sh
docker run -p 443:8443 -e YOURDOMAIN=<yourdomain.com> proxytg
```
## Run Ansible role
Put your certificate(cert.crt) and key(cert.key) to the directory ansible/files

Fill in the variables in the file: ansible/vars/main.yaml

In the directory ansible/, run:
```sh
ansible-playbook install_proxy.yml -i inventory 
```
