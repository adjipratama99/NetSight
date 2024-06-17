# NetSight Dashboard

NetSight is used for Monitoring network and see daily, weekly or monthly bandwith  are being used.


## Installation

- Clone this project to the desired server.
```bash
  git clone git@github.com:fvckdecops/NetSight.git [custom-directory-name]
```  
- Go to directory where the repository are cloned and install the package.
```bash
    cd [custom-directory-name] && npm install
```
- Create env (**.env.local** for _development_ and **.env.production** for _production_) file and input necessary variable into that env file.
- Run this command below after that:
```bash
    Development: npm run dev
    Production: npm run build && npm run start
```
## Authors

- [@Bagas Adji Pratama](https://github.com/fvckdecops)