# YASA - Yet Another Solr Admin 
[![Solr Version](https://img.shields.io/badge/Solr-6.1.0-D9411E.svg)](http://lucene.apache.org/solr/)
[![Vuejs Version](https://img.shields.io/badge/Vuejs-2.5.2-4fc08d.svg)](https://vuejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

Dashboard | Discover | Visualize
:---: | :---: | :---:
![dashboard](https://user-images.githubusercontent.com/15965696/44301073-c3ec9c00-a343-11e8-8917-44d90657af9b.png) | ![discover](https://user-images.githubusercontent.com/15965696/44305860-90e2f080-a3b5-11e8-8d85-ee3a2f247919.png) | ![visualize](https://user-images.githubusercontent.com/15965696/44301078-c8b15000-a343-11e8-98f9-135897212be8.png)
**Dev Tools** | **Zookeeper Tree Management** | **Collection Management**
![dev-tools](https://user-images.githubusercontent.com/15965696/44301074-c5b65f80-a343-11e8-85de-f5bc859ed221.png) | ![management-tree](https://user-images.githubusercontent.com/15965696/44301077-c8b15000-a343-11e8-8ed8-16f786ca8671.png) | ![management-collections](https://user-images.githubusercontent.com/15965696/44301076-c818b980-a343-11e8-906c-d72f7637f380.png)

## Installation

### Standalone Mode

You can install **YASA** in standalone mode without affecting the official Solr Admin. Here is how:

- Download [the latest release](https://github.com/kezhenxu94/yasa/releases) of YASA
- Extract files from `yasa-vX.Y.tgz` (where `X.Y` is the version number) to a directory, sayn `YASA_HOME`
- Configure your Nginx server and proxy `/solr/**` to your actual Solr Admin address, e.g. `http://127.0.0.1:8983/solr`.

> Here is a Nginx configuration sample

```nginx
worker_processes auto;

events {
	worker_connections 1024;
}

http {
	sendfile            on;
	tcp_nopush          on;
	tcp_nodelay         on;
	keepalive_timeout   65;
	types_hash_max_size 2048;

	include             /usr/local/nginx/conf/mime.types;
	default_type        application/octet-stream;

	upstream solr {
		server 127.0.0.1:8983; # replace 127.0.0.1:8983 with your Solr host and port
	}

	server {
		server_name 127.0.0.1;
		listen 7389;
		root <YASA_HOME>; # replace <YASA_HOME> with your actual directory path

		location /solr/ {
			location /solr/static/ {
				rewrite /solr/static/(.*) /static/$1;
			}
			location /solr/ {
				proxy_pass http://solr/solr/;
			}
		}
	}
}
```

### Integration Mode

You can also replace the official admin interface with **YASA**:

- Download [the latest release](https://github.com/kezhenxu94/yasa/releases) of YASA
- Extract files from `yasa-vX.Y.tgz` (where `X.Y` is the version number) to a directory, say `YASA_HOME`
- (Optional but recommended) Backup the Solr webapp folder (`solr-x-y-z/server/solr-webapp/webapp`, where `x-y-z` is the version number)
- Copy everything under `${YASA_HOME}/dist/` folder to `solr-x-y-z/server/solr-webapp/webapp`  

### Developement Mode

If you are interesting in `YASA` and want to contribute, you can run `YASA` in dev mode:

``` bash
# pull source code
git clone https://github.com/kezhenxu94/yasa

# install dependencies
npm i

# serve with hot reload at localhost:8080
npm run dev
```

## Todo

- More visualization charts
- Documentations

## Contribution

Find this project useful? Any contributions are highly appreciated. You can open issues or pull requests to help make this project better.

## Acknowledgements

- Thanks to the great work of Solr community.

- This project is greatly inspired by [Kibana](https://github.com/elastic/kibana).
