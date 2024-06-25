// Function to convert a string to title case

import moment from 'moment';

const toTitleCase = (str: string) => {
    // Capitalize the first letter of each word in the string
    return str?.replace(/\b\w/g, (char) => char.toUpperCase()).replace(/\//g, '  / ');
}

const monthDate: { [key: number]: number } = {
    1: 31,
    2: 29,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31
}

let domain: any;

if (typeof window !== "undefined") {
    domain = process.env.NODE_ENV === "development" ? new URL(window.location.href) : "localhost";
}


export const setLocal = (key: any, value: any) => {
    if (value != undefined || value != null) localStorage.setItem(key, value);
};

export const getLocal = (key: any) => {
    if (typeof window != "undefined") {
        const item1 = localStorage.getItem(key);
        return item1;
    }
};

export const removeLocal = (key: any) => {
    if (typeof window != "undefined") {
        // Perform localStorage action
        const item = localStorage.removeItem(key);
        return item;
    }
};


// Function to set a cookie with a given name, value, and expiration days
const setCookie = (name: any, value: any, days: any) => {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    // Set the cookie with the provided name, value, and expiration date
    document.cookie = name + "=" + (value || false) + expires + "; path=/" + ";" + domain;
}

// Function to get the value of a cookie by its name
const getCookie = (name: string) => {
    var nameEQ = name + "=";
    if (typeof document !== "undefined") {
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
    }
    // Return null if the cookie with the given name is not found
    return null;
}

// Function to clear a cookie by its name
const clearCookies = (name: string) => {
    // Set the cookie's expiration date to the past to remove it
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const showFormattedDate = (date: any) => {
    return date ? moment(date).format("MM/DD/YYYY") : null;
};

const showFormattedDateTime = (date: any) => {
    return date ? moment(new Date(date)).format("MM/DD/YYYY hh:mm A") : null;
};
// Export the functions for use in other parts of the code

const currencyFormat = (num: any) => {
    num = num && num > 0 ? parseFloat(num) : 0;
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
export const fixedCurrencyFormat = (num: any) => {
    const parsedNum = Number(num);
    if (isNaN(parsedNum)) {
        // Handle non-numeric inputs like '0', '0.00', etc.
        return '$0.00';
    }
    return "$" + parsedNum.toFixed(2);
}

export const timeToMinutes = (timeString: string) => {
    if (timeString.includes(':')) {
        // Split the time string into hours and minutes
        const [hoursStr, minutesStr] = timeString.split(':');

        // Parse hours and minutes as integers
        const hours = parseInt(hoursStr, 10) || 0; // Default to 0 if not a valid integer
        const minutes = parseInt(minutesStr, 10) || 0; // Default to 0 if not a valid integer

        // Calculate total minutes
        const totalMinutes: number = hours * 60 + minutes;

        return totalMinutes;
    } else {
        // Parse the input as a single number (treated as minutes)
        const minutes = parseInt(timeString, 10) || 0; // Default to 0 if not a valid integer

        return minutes;
    }
};

export const minutesToTime = (totalMinutes: number) => {
    // Calculate hours and remaining minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Format hours and minutes as strings with leading zeros
    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');

    // Combine hours and minutes into a time string
    const timeString = `${hoursStr}:${minutesStr}`;

    return timeString;
}

export const onlyAllowNumber = (evt: any) => {
    let numValue = evt?.replace(/[^0-9.]/g, '');
    return numValue;
};
// Export the functions for use in other parts of the code
export { toTitleCase, setCookie, getCookie, clearCookies, currencyFormat, showFormattedDate, showFormattedDateTime }

export const onlyAllowNumberwithDecimal = (evt: any) => {
    let numValue = evt?.replace(/[^0-9.]/g, '');
    return numValue;
};

export const onlyAllowNumberInRange = (evt: string | undefined) => {
    if (evt === undefined) {
        return evt; // Return undefined if input is undefined
    }

    // Allow values from .1 to 1, including negative values
    let numValue = evt.replace(/[^\d.-]+/g, ''); // Remove non-numeric characters
    numValue = numValue.replace(/(\..*\.|\d*\.\d*\.\d*)/g, '.'); // Ensure only one decimal point
    numValue = numValue.replace(/(^-?0)\d+/g, '$1'); // Remove leading zeros
    if (numValue === '') return numValue; // If there are no valid numbers left, return it as is

    if (numValue === '.') {
        return '0.'; // Special case: if only a single decimal point is entered, assume 0.1
    }


    const parsedValue = parseFloat(numValue);
    if (isNaN(parsedValue)) return ''; // If parsing fails, return an empty string

    // Ensure the value is within the range .1 to 1
    if (parsedValue < 0.1) return evt;
    if (parsedValue > 1) return evt;

    return parsedValue.toString(); // Return the valid number as a string
};

// only allowed numeric numbers
export const onlyAllowedNumber = (evt: any) => {
    let numValue = evt?.replace(/[^0-9]/g, '');
    return numValue;
};


//Allow spacial charcter +, -, ( , ) 

export const onlyAllowedSpecialChar = (evt: any) => {
    let numValue = evt?.replace(/^[+\-()]+$/, '');
    return numValue;
};


// only allowed alphabets
export const onlyAllowAlphabets = (evt: any) => {
    let numValue = evt?.replace(/[^a-zA-Z]/g, '');
    return numValue;
};
//only allowed alphabets and lower char
export const onlyAllowLowerAlphabets = (evt: any) => {
    let numValue = evt?.replace(/[^a-z]/g, '');
    return numValue;
};
export const whiteSpaceRemove = (evt: any) => {
    let value = evt?.replace(/\s\s/g, '');
    return value
}

export const capitalizeFLetter = (string: any) => {
    let result = string[0].toUpperCase() + string.slice(1);
    return result
}


export const capitalizeEveryWord = (string: any) => {
    let words = string?.split(' ');

    let result = words?.map((word: any) => {
        let lowerCaseWord = word?.toLowerCase();
        return lowerCaseWord?.charAt(0).toUpperCase() + lowerCaseWord?.slice(1);
    });

    return result?.join(' ');
};

export const camelCaseWords = (str: any) => {
    return str?.replace(/\b\w/g, function (char: string) {
        return char?.toUpperCase();
    });
}
export const allowAlphabetsWithSingleSpace = (evt: any) => {
    // Remove multiple spaces and allow only alphabets and a single white space
    let value = evt?.replace(/\s+/g, ' ').replace(/[^a-zA-Z ]/g, '');
    return value;
};

export const removeUnderScrore = (string: any) => {
    const result = string.replace("_", " ");
    return result
}

export const copyTextToClipboard = async (text: any) => {
    if ('clipboard' in navigator) {
        return await navigator.clipboard.writeText(text);
    } else {
        return document.execCommand('copy', true, text);
    }
}

const numbersToWords: any = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten",
    11: "eleven",
    12: "twelve",
    13: "thirteen",
    14: "fourteen",
    15: "fifteen",
    16: "sixteen",
    17: "seventeen",
    18: "eighteen",
    19: "nineteen",
    20: "twenty",
    30: "thirty",
    40: "forty",
    50: "fifty",
    60: "sixty",
    70: "seventy",
    80: "eighty",
    90: "ninety",
};

// Define the convertNumberToWords function
export const convertNumberToWords = (number: any) => {
    // if number present in object no need to go further
    if (number in numbersToWords) return numbersToWords[number];

    // Initialize the words variable to an empty string
    let words = "";

    // If the number is greater than or equal to 100, handle the hundreds place (ie, get the number of hundres)
    if (number >= 100) {
        // Add the word form of the number of hundreds to the words string
        words += convertNumberToWords(Math.floor(number / 100)) + " hundred";

        // Remove the hundreds place from the number
        number %= 100;
    }

    // If the number is greater than zero, handle the remaining digits
    if (number > 0) {
        // If the words string is not empty, add "and"
        if (words !== "") words += " and ";

        // If the number is less than 20, look up the word form in the numbersToWords object
        if (number < 20) words += numbersToWords[number];
        else {
            // Otherwise, add the word form of the tens place to the words string
            //if number = 37, Math.floor(number /10) will give you 3 and 3 * 10 will give you 30
            words += numbersToWords[Math.floor(number / 10) * 10];

            // If the ones place is not zero, add the word form of the ones place
            if (number % 10 > 0) {
                words += "-" + numbersToWords[number % 10];
            }
        }
    }

    // Return the word form of the number
    return words;
}

// date formate for csv or excel

const currentDate = new Date();
export const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
}).replace(/\//g, '-');

export const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
}).replace(/:/g, '-');

// ------------FUNCTIONS TO BE USED WITH USEFORM-------------
export const requiredField = (field: string) => {
    return { required: `${field} is required.` };
}

export const alphabets = {
    value: /^[a-zA-Z]+$/g,
    message: 'Only alphabets are allowed.'
}

export const alphabetsWithSingleSpace = {
    value: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
    message: 'This field only contains alphabtes and a single space at most.'

}

export const alphabetsWithMultipleSpace = {
    value: /^[a-zA-Z][a-zA-Z ]+$/,
    message: 'This field only contains alphabets and spaces.'
}

export const floatNumber = {
    value: /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/,
    message: 'Enter valid number.'
}

export const timeNumber = {
    value: /^([0-9]+(:[0-9]{0,2})?|:[0-9]{0,2})$/,
    message: 'Enter valid time.'
}

export const integerNumber = {
    value: /^[0-9]+$/,
    message: 'Enter valid number.'
}

export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.match(emailRegex)) {
        return true;
    }
    return "Invalid email address.";
}

export const validateIcon = (value: any) => {
    if (value && value[0]) {
        const file = value[0];
        const validTypes = ['image/jpeg', 'image/png', 'image/svg']; // Add more valid MIME types as needed
        if (!validTypes.includes(file.type)) {
            return "Invalid file type. Only JPEG and PNG images are allowed.";
        }
        if (file.size > 524288) { // 1MB limit
            return "File size exceeds the maximum allowed size (1MB).";
        }
        return true;
    }
};

export const validatePdf = (value: any) => {
    if (value && value[0]) {
        const file = value[0];
        const validTypes = ['application/pdf']; // Add more valid MIME types as needed
        if (!validTypes.includes(file.type)) {
            return "Invalid file type. Only PDF is allowed.";
        }
        if (file.size > 5242880) { // 5MB limit
            return "File size exceeds the maximum allowed size (5MB).";
        }
        return true;
    }
};


export const validateDoc = (value: any) => {
    if (value && value[0]) {
        const file = value[0];
        const validTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']; // Add more valid MIME types as needed
        if (!validTypes.includes(file.type)) {
            return "Invalid file type. Only DOC/Docx are allowed.";
        }
        if (file.size > 5242880) { // 5MB limit
            return "File size exceeds the maximum allowed size (5MB).";
        }
        return true;
    }
};

export const validateAttachment = (value: any) => {
    if (value && value[0]) {
        const file = value[0];
        if (file.type === "application/pdf") {
            if (file.size > 5242880) { // 1MB limit
                return "File size exceeds the maximum allowed size (5MB).";
            }
        }
        else if (file.type == 'application/msword' || file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            if (file.size > 5242880) { // 5MB limit
                return "File size exceeds the maximum allowed size (5MB).";
            }
        }
        else if (file.type == "image/png" || file.type == "image/jpeg") {
            if (file.size > 1048576) { // 1MB limit
                return "File size exceeds the maximum allowed size (1MB).";
            }
        } else {
            return "Invalid file type. Only PDF, DOC/Docx, JPEG, and PNG images are allowed.";
        }
        return true;
    }
}

export const validateLength = (value: any) => {
    if (value.length < 5) {
        return `This field must be at least 5 characters long.`;
    }
    if (value.length > 100) {
        return `This field must be at most 100 characters long.`;
    }
    return true;
}


export const validateDescriptionLength = (value: any) => {
    if (value) {
        if (value.length < 10) {
            return `This field must be at least 10 characters long.`;
        }
        if (value.length > 1000) {
            return `This field must be at most 1000 characters long.`;
        }
    }
    return true;
}


export const validateImage = (value: any) => {
    if (value && value[0]) {
        const file = value[0];
        const validTypes = ['image/jpeg', 'image/png']; // Add more valid MIME types as needed
        if (!validTypes.includes(file.type)) {
            return "Invalid file type. Only JPEG and PNG images are allowed.";
        }
        if (file.size > 1048576) { // 10MB limit
            return "File size exceeds the maximum allowed size (1MB).";
        }
        return true;
    }
    console.log(value)
};


export const decodeHTML = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};


function isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export const validateDate = (date: string) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!date.match(dateRegex)) {
        return "Invalid date format. Please use the format YYYY-MM-DD.";
    }
    const [year, month, day] = date.split('-').map(Number);
    if (year < 1000 || year > 9999) {
        return "Invalid year. Please enter a 4-digit year.";
    }

    if (month < 0 || month > 12) {
        return "Invalid month. Please enter a valid month.";
    }

    if (day < 0 || day > 31) {
        return "Invalid day. Please enter a valid day.";
    }

    if (month == 2 && day == 29) {
        if (!isLeapYear(year)) {
            return "Invalid date. February has 29 days only in leap years.";
        }
    }

    if (monthDate[month] <= day) {
        return "Provide valid date.";
    }

}

export const validateContact = (contact: any) => {
    const contactRegex = /^[0-9]{10}$/;
    if (!contact) {
        return true;
    }
    if (contact.match(contactRegex)) {
        return true;
    }
    
    return "Invalid contact number.";

}

export const validateZip = (zip: any) => {
    const zipRegex = /^[0-9]{6}$/;
    if (!zip) {
        return true;
    }
    if (zip.match(zipRegex)) {
        return true;
    }
    
    return "Invalid zip number.";

}

export const validateFutureDate = (date: Date) => {
    const inputDate = new Date(date);
    const currentDate = new Date();

    if (inputDate < currentDate) {
        return "Past date selection is not allowed";
    }
};
export const validatePastDate = (date: Date) => {
    const inputDate = new Date(date);
    const currentDate = new Date();

    if (inputDate > currentDate) {
        return "Future date selection is not allowed";
    }
};

export const validateActive = (value: any) => {
    console.log("value here is this: ", value)
    if (value !== 'true' && value !== 'false') {
        return "Please select active or inactive."
    }
}

export const validatePassword = (password: string) => {
    if (password.length < 8) {
        return "Your password must be at least 8 characters";
    }
    if (password.search(/[a-z]/i) < 0) {
        return "Your password must contain at least one small letter.";
    }
    if (password.search(/[A-Z]/i) < 0) {
        return "Your password must contain at least one small letter.";
    }
    if (password.search(/[!@#\$%\^&\*]/i) < 0) {
        return "Your password must contain at least one special character.";
    }
    if (password.search(/[0-9]/) < 0) {
        return "Your password must contain at least one digit.";
    }

    return true;
}

export const requiredMessage = 'This field is required.';

export const getLocationData = async () => {
    const userLocation: any = {};

    const fetchUserGeolocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    userLocation.latitude = latitude;
                    userLocation.longitude = longitude;
                },
                (error) => {
                    console.error('Error getting geolocation:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    const fetchUserIPAddress = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            userLocation.ip = data.ip;
        } catch (error) {
            console.error('Error fetching IP address:', error);
        }
    };

    const fetchUserLocationInfo = async () => {
        try {
            await fetchUserGeolocation();
            await fetchUserIPAddress();

            // Fetch additional location info from an API based on user's IP
            const ip = userLocation.ip;
            const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,query`);
            const data = await response.json();

            userLocation.country = data.country;
            userLocation.location = data.city + ', ' + data.regionName + ', ' + data.country + ', ' + data.zip;
            userLocation.zip = data.zip;
            userLocation.state = data.regionName;
            userLocation.browser = navigator.userAgent; // Fetching browser info
        } catch (error) {
            console.error('Error fetching location info:', error);
        }
    };

    await fetchUserLocationInfo();

    return userLocation;
};
