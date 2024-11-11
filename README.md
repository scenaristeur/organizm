# Getting started
- first thing to start is good musik https://www.radiofrance.fr/fip/radio-groove




# Run a Community Solid Server
- https://communitysolidserver.github.io/CommunitySolidServer/latest/
```
# install
npm install -g @solid/community-server
# run
community-solid-server -c @css:config/file.json -f data/
```
then 
- open http://localhost:3000 to see if CSS (Community Solid Server) is running 
- sigup for an account at http://localhost:3000/.account/login/password/register/
- create a pod and a token

![alt text](./doc/images/pod_creation.png)


# env
- cp .env_example to .env and replace this values with yours

```
VITE_SOLID_BASE_URL="http://localhost:3000"
VITE_SOLID_POD="http://localhost:3000/xxxxxxxxxx/"
VITE_SOLID_WEBID="http://localhost:3000/xxxxxxxxxxxx/profile/card#me"
VITE_SOLID_TOKEN_IDENTIFIER="localhost_xxxxxxxxxxxx"
VITE_SOLID_TOKEN_SECRET="xxxxxxxxxxxxxxxxxxxxxxxxx"
```