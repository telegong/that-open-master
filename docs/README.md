## That Open Master Dev Lesson 2 Final Challenge Submit
Thanks to Juan Hoyos!!



===================================================================================================
## git clone
```cs
PS D:\ThatOpenMaster\masterbimdev> git clone https://github.com/telegong/that-open-master.git
Cloning into 'that-open-master'...
remote: Enumerating objects: 35, done.
remote: Counting objects: 100% (35/35), done.
remote: Compressing objects: 100% (24/24), done.
remote: Total 35 (delta 11), reused 35 (delta 11), pack-reused 0
Unpacking objects: 100% (35/35), done.
Checking connectivity... done.

PS D:\ThatOpenMaster\masterbimdev\that-open-master> npm i

PS D:\ThatOpenMaster\masterbimdev\that-open-master> npm run dev

> that-open-master@1.0.0 dev
> vite


  VITE v5.2.7  ready in 343 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## VITE server --host Option for LAN Network
```cs
Copilot
Certainly! To expose your VITE server to the Local Area Network (LAN), you can use the --host flag. Here are a few ways to achieve this:

Command Line (Terminal):
While running your VITE application, open your terminal or command prompt.
Use the following command:
> npm run dev -- --host

This will start your VITE development server and expose it to other devices on the same network.
Update package.json:
Open your package.json file.
Locate the "scripts" section.
Modify the "dev" script to include the --host flag:
JSON

"scripts": {
    "dev": "vite --host"
}
AI가 생성한 코드입니다. 신중하게 검토하고 사용하세요. FAQ의 자세한 정보.
Save the changes.
Now, when you run npm run dev, your VITE server will be accessible on other devices within your LAN.
VITE Configuration File (vite.config.js):
If you prefer to configure this directly in your VITE project, you can add the following to your vite.config.js:
JavaScript

export default {
    server: {
        host: true
    }
};
AI가 생성한 코드입니다. 신중하게 검토하고 사용하세요. FAQ의 자세한 정보.
This will automatically enable LAN access when you run your VITE application.
Remember that all files in your VITE project will be accessible to anyone on your network, so ensure proper security measures if needed. Happy coding! 🚀
```

## VITE server --host Option for WIFI Network
```cs
나
only to expose VITE server to the WIFI network,  
how can i use --host flag for WIFI Server IP only?

Copilot
Certainly! To expose your VITE server to the WiFi network using a specific IP address, you can follow these steps:

Update package.json:
Open your package.json file.
Locate the "scripts" section.
Modify the "dev" script to include the --host flag followed by the desired IP address:
JSON

"scripts": {
    "dev": "vite --host 192.168.1.100"
}
AI가 생성한 코드입니다. 신중하게 검토하고 사용하세요. FAQ의 자세한 정보.
Replace 192.168.1.100 with the actual IP address you want to use.
Save the changes.
Now, when you run npm run dev, your VITE server will be accessible on the specified IP address within your WiFi network.
VITE Configuration File (vite.config.js):
Alternatively, you can update your vite.config.js file directly:
JavaScript

export default {
    server: {
        host: '192.168.1.100'
    }
};
AI가 생성한 코드입니다. 신중하게 검토하고 사용하세요. FAQ의 자세한 정보.
Replace '192.168.1.100' with your desired IP address.
This will automatically bind your VITE application to the specified IP address when you run it.
Remember to adjust the IP address according to your network configuration. Keep in mind that exposing your VITE application to the network makes all files in your project accessible to anyone on the network, so ensure proper security measures if needed. Happy coding! 🚀
```

```cs
To expose my VITE server to the WIFI network using a specific IP address,
How can I do on the command line(Terminal)?

Copilot
Certainly! To expose your VITE server to the WiFi network using a specific IP address, you have a couple of options:

Using the --host Flag:
While running your VITE application, open your terminal or command prompt.
Navigate to your project directory.
Use the following command, replacing 192.168.1.100 with your desired IP address:
> npm run dev -- --host 192.168.1.100

This will start your VITE development server and make it accessible on the specified IP address within your WiFi network.
Using npx (if you don’t want to modify package.json):
Open your terminal or command prompt.
Navigate to your project directory.
Run the following command:
> npx vite --host 192.168.1.100

Make sure to issue the command from your project’s root directory (where your package.json file is located).
Remember that exposing your VITE application to the network makes all files in your project accessible to anyone on the network, so ensure proper security measures if needed. Happy coding! 🚀
```

## VITE server on Command Line(Terminal)
```cs
PS D:\ThatOpenMaster\masterbimdev\that-open-master> npm run dev -- --host

> that-open-master@1.0.0 dev
> vite --host


  VITE v5.2.7  ready in 314 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://169.254.181.5:5173/
  ➜  Network: http://192.168.240.1:5173/
  ➜  Network: http://192.168.0.4:5173/
  ➜  Network: http://172.30.1.36:5173/
  ➜  press h + enter to show help
q
PS D:\ThatOpenMaster\masterbimdev\that-open-master> npm run dev -- --host 172.30.1.36

> that-open-master@1.0.0 dev
> vite --host 172.30.1.36   


  VITE v5.2.7  ready in 304 ms

  ➜  Network: http://172.30.1.36:5173/
h

  Shortcuts
  press r + enter to restart the server
  press u + enter to show server url
  press o + enter to open in browser
  press c + enter to clear console
  press q + enter to quit
u

  ➜  Network: http://172.30.1.36:5173/
q
PS D:\ThatOpenMaster\masterbimdev\that-open-master> npx vite --host

  VITE v5.2.7  ready in 314 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://169.254.181.5:5173/
  ➜  Network: http://192.168.240.1:5173/
  ➜  Network: http://192.168.0.4:5173/
  ➜  Network: http://172.30.1.36:5173/
  ➜  press h + enter to show help
q
PS D:\ThatOpenMaster\masterbimdev\that-open-master> npx vite --host 172.30.1.36

  VITE v5.2.7  ready in 305 ms

  ➜  Network: http://172.30.1.36:5173/
  ➜  press h + enter to show help


PS D:\ThatOpenMaster\masterbimdev\projectList-copilot> npx vite                
Need to install the following packages:
vite@5.2.7
Ok to proceed? (y) y
Port 5173 is in use, trying another one...

  VITE v5.2.7  ready in 416 ms      

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose  
  ➜  press h + enter to show help   
```

