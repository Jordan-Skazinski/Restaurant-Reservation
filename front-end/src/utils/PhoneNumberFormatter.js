export default function formatPhoneNumber(value) {
    if(!value) return value
    const phoneNumber = value.replace(/[^\d]/g,"")
    if(phoneNumber.length < 5) return phoneNumber
    if(phoneNumber.length < 8) {
        return `${phoneNumber.slice(0,3)}-${phoneNumber.slice(3)}`
    }
    return `${phoneNumber.slice(0,3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
}