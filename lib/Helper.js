import { format, subDays, subMonths, subWeeks, subYears } from "date-fns"

export const isObject = (data) => (
    typeof data === 'object' &&
    !Array.isArray(data) &&
    data !== null
)

export const formatIp = (xForwardedFor) => {
    const regex = /[^:f/]+/g
    const results = xForwardedFor.match(regex)
    return results[0]
}

export async function * asyncCounter(limit) {
  let i = 0;
  while (i < limit) {
      yield i++;
  }
}


export function formatMsisdn(msisdn) {
    var formatted = msisdn.trim();
    formatted = formatted.replace(/\D/g,'');
    
    if (formatted.substring(0, 1) == "0") {
        formatted = "62" + formatted.substring(1);
    } else if (formatted.substring(0, 1) == "8") {
        formatted = "62" + formatted.substring(0);
    }
    
    return formatted;
}

const getMiddle = (prop, markers) => {
    let values = markers.map(m => m[prop]);
    let min = Math.min(...values);
    let max = Math.max(...values);
    if (prop === 'lng' && (max - min > 180)) {
      values = values.map(val => val < max - 180 ? val + 360 : val);
      min = Math.min(...values);
      max = Math.max(...values);
    }
    let result = (min + max) / 2;
    if (prop === 'lng' && result > 180) {
      result -= 360
    }
    return result;
  }
  
export function findCenter(markers) {
    return {
        lat: getMiddle('lat', markers),
        lng: getMiddle('lng', markers)
    }
}

export const getMedia = async (fileName, returnBlob) => {
    const res = await fetch('/api/media?fileName='+ fileName +'&id=msisdn-imei')
    const data = await res.blob()
    const image = (returnBlob) ? data : URL.createObjectURL(data)
    return image
}

export const blobToBase64 = async (blob) => {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

export const sleep = ms => new Promise(r => setTimeout(r, ms));

export const copyToClipboard = (text, elem) => {
    if (window.clipboardData && window.clipboardData.setData) {
        return window.clipboardData.setData("Text", text);
    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;

        if (elem) {
            $(elem).parent().append(textarea);
            textarea.select();

            try {
                return 'Copied to clipboard!' && document.execCommand("copy");
            }
            catch (ex) {
                return "Copy to clipboard failed"
            }
            finally {
                textarea.remove();
            }
        } else {
            textarea.style.position = "fixed";
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return 'Copied to clipboard!' && document.execCommand("copy");
            }
            catch (ex) {
                return "Copy to clipboard failed";
            }
            finally {
                document.body.removeChild(textarea);
            }
        }
    }
}

export const secToTime = (time, withoutSecond) => {
    var sec_num = parseInt(time, 10);
    var days    = Math.floor(sec_num / 86400);
    var hours   = Math.floor((sec_num - (days * 86400)) / 3600);
    var minutes = Math.floor((sec_num - (days * 86400) - (hours * 3600)) / 60);
    var seconds = sec_num - (days * 86400) - (hours * 3600) - (minutes * 60);

    var format = '';
    format += ((days > 0) ? days + ' days ' : '');
    format += ((hours > 0) ? hours + ' hours ' : '');
    format += ((minutes > 0) ? minutes + ' minutes ' : '');
    if (! withoutSecond) format += ((seconds > 0) ? seconds + ' seconds ' : '');

    return format;
}

export const imageOperator = (phoneNumber) => {
    if (phoneNumber) {
        let prefixData = [
            {
                "prefix" : ["62811", "62812", "62813", "62821", "62822", "62823", "62851", "62852", "62853"],
                "operator_name" : "Telkomsel",
                "operator_code" : "tsel",
                "image_path" : "/assets/icon/lg_telkomsel.png"
            },
            {
                "prefix" : ["62814", "62815", "62816", "62816", "62855", "62816", "62815", "62858", "62856", "62857"],
                "operator_name" : "Indosat",
                "operator_code" : "isat",
                "image_path" : "/assets/icon/lg_indosat.png"
            },        
            {
                "prefix" : ["62817", "62818", "62819", "62818", "62819", "62859", "62877", "62878", "62879", "62817", "62831"],
                "operator_name" : "Exelcomindo",
                "operator_code" : "xl",
                "image_path" : "/assets/icon/lg_xl.png"
            },        
            {
                "prefix" : ["62895", "62896", "62897", "62898", "62899"],
                "operator_name" : "Hutchinson",
                "operator_code" : "hutch",
                "image_path" : "/assets/icon/lg_hut.png"        
            },        
            {
                "prefix" : ["62881", "62882", "62883", "62884", "62885", "62886", "62887", "62888", "62889"],
                "operator_name" : "Smartfren",
                "operator_code" : "Smartfren",
                "image_path" : "/assets/icon/lg_smartfren.png"
            },        
            {
                "prefix" : ["62831", "62832", "62833", "62838"],
                "operator_name" : "Axis",
                "operator_code" : "axis",
                "image_path" : "/assets/icon/lg_axis.png"
            }         
        ];
    
        let prefixMsisdn = formatMsisdn(phoneNumber).substring(0,5)
        let result = null
        prefixData.forEach(e => {
            if (e.prefix.indexOf(prefixMsisdn) > -1) result = e;
        })

        return result
    } else {
        return null
    }
}

export const randNumber = (val) => Math.floor(Math.random() * val)

export const Initials = (val) => {
    const data = val.split(' ')

    return data.map(name => name.slice(0, 1)).join('')
}

export const subtractDate = (date, type, subtracts) => {
    let subtractedDate

    switch(type) {
        case "weeks":
            subtractedDate = subWeeks(date, subtracts)
            break
        case "months":
            subtractedDate = subMonths(date, subtracts)
            break
        case "years":
            subtractedDate = subYears(date, subtracts)
            break
        default:
            subtractedDate = subDays(date, subtracts)
    }

    return format(subtractedDate, 'yyyy-MM-dd HH:mm:ss')
}

export const formatBytes = (bytes, decimals = 2) => {
    bytes = Math.abs(bytes);
    if (!+bytes) return { val: 0, unit: "Bytes" }

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    let i = Math.floor(Math.log(bytes) / Math.log(k))
    if (i === -1) i = 0;

    return { val: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)), unit: sizes[i] };
}

export const percentageOf = (total, value) => {
    const percent = value / total * 100;
    return percent.toFixed(2);
}