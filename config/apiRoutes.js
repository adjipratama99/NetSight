export const destination = {
    "monitoring": {
      "getDevices": { action: 'devices', subAction: 'list' },
      "updateDevice": { action: 'devices', subAction: 'update' },
      "getBandwith": { action: 'bandwith', subAction: 'list' },
      "getAlertListEvent": { action: "alerts", subAction: "listEvent" },
      "getAlertList": { action: "alerts", subAction: "list" },
      "insertAlertData": { action: "alerts", subAction: "insert" },
      "deleteAlertData": { action: "alerts", subAction: "delete" }
    }
}