import axios from "axios";
import { IOneClickAppIdentifier } from "../models/IOneClickAppModels";

const BASE_URL = "https://oneclickapps.caprover.com/v1";

export default class OneClickAppsApi {
  getOneClickAppByName(appName: string) {
    const self = this;
    return self.getAllOneClickApps().then(function(data) {
      if (!appName) throw new Error("appName is empty!");

      const url = data.filter(value => value.name === appName)[0].url;

      return axios
        .get(url) //
        .then(function(res) {
          // res contains data, headers, and etc...
          return res.data;
        });
    });
  }

  getAllOneClickApps() {
    return axios
      .get(`${BASE_URL}/autoGeneratedList.json`) //
      .then(function(res) {
        // res contains data, headers, and etc...
        const apps = res.data.appList as string[];
        return apps.map(element => {
          const ret: IOneClickAppIdentifier = {
            name: element,
            url: `${BASE_URL}/apps/${element}.json`
          };
          return ret;
        });
      })
      .then(function(data) {
        // sorting alphabetically
        return data.sort((a, b) => {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });
      });
  }
}
