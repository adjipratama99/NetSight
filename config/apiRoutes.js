export const destination = {
    "monitoring": {
      "getDevices": { action: 'devices', subAction: 'listF' },
      "summaryDevice": { action: 'devices', subAction: 'summaryDevice' },
      "updateDevice": { action: 'devices', subAction: 'update' },
      "getBandwith": { action: 'bandwith', subAction: 'getHistoryF' },
      "getAlertListEvent": { action: "alerts", subAction: "listEvent" },
      "getAlertList": { action: "alerts", subAction: "list" },
      "insertAlertData": { action: "alerts", subAction: "insert" },
      "deleteAlertData": { action: "alerts", subAction: "delete" }
    }
}