
Please read the code below thoroughly. First by the epic and after that, all the functions.
These are the steps this epic needs to follow to see a successful upgrade.


1. `Load the FS to firmware.upload()`
2. `Call firmware.startUpgrade({url:<last step>})`
3. `Stop the network polling`

4. `Poll firmware.getUpgradeStatus() until STATUS==="complete"`
5. `Poll the list of existing SSID and wait for the waiting the SSID is up`
6. `Once it finds the object wait for 30 seconds`
7.  `if(connection successful) happy`
    `else error`
