import React from "react";

export const useNotification = (alerts:any[]) => {

React.useEffect(()=>{
if(
 "Notification" in window &&
 Notification.permission === "granted" &&
 alerts.length > 0
){

alerts.forEach(alert=>{
new Notification(
`⚠️ ${alert.event}`,
{
body:
`${alert.description}`
}
);
});
}
},[alerts]);


};