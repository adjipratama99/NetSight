export const destination = {
    "monitoring": {
      "getDeviceList": { action: 'devices', subAction: 'listF' },
      "getDevices": { action: 'devices', subAction: 'list' },
      "summaryDevice": { action: 'devices', subAction: 'summaryDevice' },
      "updateDevice": { action: 'devices', subAction: 'update' },
      "getSummaryBandwith": { action: 'bandwith', subAction: 'getHistoryF' },
      "getBandwith": { action: 'bandwith', subAction: 'getHistory' },
      "getAlertListEvent": { action: "alerts", subAction: "listEvent" },
      "getAlertList": { action: "alerts", subAction: "list" },
      "insertAlertData": { action: "alerts", subAction: "insert" },
      "deleteAlertData": { action: "alerts", subAction: "delete" }
    }
}