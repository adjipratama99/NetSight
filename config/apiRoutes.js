export const destination = {
    "monitoring": {
      "getDevices": { action: 'device', subAction: 'list' },
      "getBandwith": { action: 'bandwith', subAction: 'list' },
      "getAlertList": { action: "alert", subAction: "list" },
      "insertAlertData": { action: "alert", subAction: "insert" },
      "deleteAlertData": { action: "alert", subAction: "delete" }
    }
}