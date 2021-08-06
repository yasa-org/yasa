# Installation
## Solr Package (Recommended as of Solr 8.6)

You can install YASA as a Solr package:

    bin/solr package add-repo yasa "https://raw.githubusercontent.com/yasa-org/yasa/master/repo/"

    bin/solr package install yasa

    bin/solr package deploy yasa -y -cluster
Then navigate your browser to [http://localhost:8983/v2/yasa](http://localhost:8983/v2/yasa).

To register YASA at another path, you can use:

    bin/solr package deploy yasa -y -cluster -p YASA-PATH-PREFIX=mysolrui
Then navigate your browser to [http://localhost:8983/v2/mysolrui](http://localhost:8983/v2/mysolrui).

### Updating to a newer version
To check installed version and available versions of the package:

    bin/solr package list-installed

    bin/solr package list-available
To update to a newer version:

    bin/solr package install yasa:<new-version>

    bin/solr package deploy yasa:<new-version> -y -cluster -update
### Undeploying
To undeploy,

    bin/solr package undeploy yasa -cluster

Click for a [Colab demo](https://colab.research.google.com/github/TheSearchStack/notebooks/blob/master/Apache_Solr_with_Yasa_Dashboard.ipynb).

## Standalone Mode
You can install YASA in the standalone mode without affecting the official Solr Admin. Here is how:

* Download the latest release of yasa.

* Extract files from `yasa-vX.Y.tgz` (where X.Y is the version number) to a directory, say `YASA_HOME`.

* Configure your Nginx server and proxy /solr/** to your actual Solr Admin address, for example, [http://127.0.0.1:8983/solr](http://127.0.0.1:8983/solr).

Here is an [Nginx configuration sample](https://github.com/yasa-org/yasa/blob/master/docker/nginx.conf).

## Integrated Mode
You can also replace the official admin interface with YASA:

* Download the latest release of YASA

* Extract files from `yasa-vX.Y.tgz` (where X.Y is the version number) to a directory, say `YASA_HOME`

* (Optional but recommended) Backup the Solr webapp folder (`solr-x-y-z/server/solr-webapp/webapp`, where x-y-z is the version number)

* Copy everything under `${YASA_HOME}/dist/` folder to `solr-x-y-z/server/solr-webapp/webapp`.

## Development Mode
If you are interested in YASA and want to contribute, you can run YASA in dev mode:

    # pull source code
    git clone https://github.com/yasa-org/yasa

    cd yasa/yasa-ui

    # install dependencies
    npm i

    # serve with hot reload at localhost:8080
    npm run serve

##