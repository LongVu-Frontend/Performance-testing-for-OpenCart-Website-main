# Content

- [Load testing Report](https://github.com/musthafiz/Performance-testing-for-OpenCart-Website#load-testing-report)
- [Summary](https://github.com/musthafiz/Performance-testing-for-OpenCart-Website#summary)
- [Introduction](https://github.com/musthafiz/Performance-testing-for-OpenCart-Website#introduction)
- [Install](https://github.com/musthafiz/Performance-testing-for-OpenCart-Website#install)
- [Prerequisites](https://github.com/musthafiz/Performance-testing-for-OpenCart-Website#prerequisites)
- [Elements of a Minimal Test Plan](https://github.com/musthafiz/Performance-testing-for-OpenCart-Website#prerequisites)
- [Test Plan](https://github.com/musthafiz/Performance-testing-for-OpenCart-Website#test-plan)
- [Collection of API](https://github.com/musthafiz/Performance-testing-for-OpenCart-Website#collection-of-api)
  - [List of API](https://github.com/musthafiz/Performance-testing-for-OpenCart-Website#list-of-api)
  - [Load the JMeter Script](https://github.com/musthafiz/Performance-testing-for-OpenCart-Website#load-the-jmeter-script)
- [Make csv File](https://github.com/musthafiz/Performance-testing-for-OpenCart-Website#make-csv-file)
- [Make jtl File](https://github.com/musthafiz/Performance-testing-for-OpenCart-Website#make-jtl-file)
- [Make html File](https://github.com/musthafiz/Performance-testing-for-OpenCart-Website#make-html-file)
- [HTML Report](https://github.com/musthafiz/Performance-testing-for-OpenCart-Website#html-report)
- [Stress Testing](https://github.com/musthafiz/Performance-testing-for-OpenCart-Website#stress-testing)
- [Spike Testing](https://github.com/musthafiz/Performance-testing-for-OpenCart-Website#spike-testing)
- [Endurance Testing](https://github.com/musthafiz/Performance-testing-for-OpenCart-Website#endurance-testing)
- [Read Test Data from CSV file in Jmeter](https://github.com/musthafiz/Performance-testing-for-OpenCart-Website#read-test-data-from-csv-file-in-jmeter)

# Load testing Report

| Concurrent Request | Loop Count | Avg TPS for Total Samples | Error Rate | Total Concurrent API request |
| :----------------: | :--------: | :-----------------------: | :--------: | :--------------------------: |
|         1          |     1      |           3.350           |     0%     |             212              |
|         2          |     1      |             7             |     0%     |             424              |
|         3          |     1      |            11             |   0.47%    |             636              |
|         4          |     1      |           14.1            |   0.59%    |             848              |
|         5          |     1      |           17.6            |   0.94%    |             1060             |
|         6          |     1      |            20             |   1.18%    |             1272             |

### Summary

- While executed 3 concurrent request, found 636 request got connection timeout and error rate is 0.47%.
- Server can handle almost concurrent 424 API call with almost zero (0) error rate.

# Introduction

This document explains how to run a performance test with JMeter against an OpenCart E-commerce Site.

# Install

**Java**  
https://www.oracle.com/java/technologies/downloads/

**JMeter**  
https://jmeter.apache.org/download_jmeter.cgi

Click =>Binaries  
=>**apache-jmeter-5.6.3.zip**

**We use BlazeMeter to generate JMX files**  
https://chrome.google.com/webstore/detail/blazemeter-the-continuous/mbopgmdnpcbohhpnfglgohlbhfongabi?hl=en

# Prerequisites

- As of JMeter 4.0, Java 8 and above are supported.
- we suggest multicore cpus with 4 or more cores.
- Memory 16GB RAM is a good value.

# Elements of a minimal test plan

- Thread Group

  The root element of every test plan. Simulates the (concurrent) users and then run all requests. Each thread simulates a single user.

- HTTP Request Default (Configuration Element)

- HTTP Request (Sampler)

- Summary Report (Listener)

# Test Plan

Testplan > Add > Threads (Users) > Thread Group (this might vary dependent on the jMeter version you are using)

- Name: Users
- Number of Threads (users): 1 to 6
- Ramp-Up Period (in seconds): 10
- Loop Count: 1

  1. The general setting for the tests execution, such as whether Thread Groups will run simultaneously or sequentially, is specified in the item called Test Plan.

  2. All HTTP Requests will use some default settings from the HTTP Request, such as the Server IP, Port Number, and Content-Encoding.

  3. Each Thread Group specifies how the HTTP Requests should be carried out. To determine how many concurrent "users" will be simulated, one must first know the number of threads. The number of actions each "user" will perform is determined by the loop count.

  4. The HTTP Header Manager, which allows you to provide the Request Headers that will be utilized by the upcoming HTTP Requests, is the first item in Thread Groups.

# Collection of API

- Run BlazeMeter
- Collect Frequently used API
- Save JMX file then paste => **apache-jmeter-5.6.3\bin**

  ### List of API

  - [http://localhost/Classic-Groove-main/](http://localhost/Classic-Groove-main/)

  **OR**

  ### Load the JMeter Script

  - File > Open (CTRL + O)
  - Locate the "Classic-Groove_T1.jmx" file contained on this repo
  - Continue open Classic-Groove_T1 to Classic-Groove_T6
  - Open those file
  - The Test Plan will be loaded

  ![image](https://github.com/user-attachments/assets/d9557770-d348-4302-bb88-368176737051)

# Test execution (from the Terminal)

- JMeter should be initialized in non-GUI mode.
- Make a report folder in the **bin** folder.
- Run Command in **jmeter\bin** folder.

### Make csv file

- **n**: non GUI mode
- **t**: test plan to execute
- **l**: output file with results

```bash
  jmeter -n -t  Classic-Groove_T1.jmx -l Classic-Groove_T1.csv
```

![image](https://github.com/user-attachments/assets/dd9644f1-37af-4fa2-b0f0-daf247c916f9)

### Make jtl file

```bash
  jmeter -n -t  Classic-Groove_T1.jmx -l Classic-Groove_T1.jtl
```

Then continue to upgrade Threads(1 to 6) by keeping Ramp-up Same.

![image](https://github.com/user-attachments/assets/26ed0554-9e9f-4fdd-8f2d-868f94a5b11d)
![image](https://github.com/user-attachments/assets/7d6d2dcb-76c7-4afd-94ea-88071ccafe63)

After completing this command

### Make html file

```bash
jmeter -g report\Classic-Groove_T1.jtl -o Classic-Groove_T1.html
```

- **g**: jtl results file

- **o**: path to output folder

![image](https://github.com/user-attachments/assets/9b794dfd-b30e-4fbd-bb69-d710adb712df)
![image](https://github.com/user-attachments/assets/09dfc46f-4b58-46c1-9ecc-eee0375ed896)

# HTML Report

**Number of Threads 1 ; Ramp-Up Period 10s**

|                                              Requests Summary                                               |                                                   Errors                                                    |
| :---------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
| ![1](https://user-images.githubusercontent.com/92669932/189543492-df0751ca-3642-4e3f-a050-0454e38117ef.jpg) | ![2](https://user-images.githubusercontent.com/92669932/189543499-17c168a2-5b32-4710-9bc0-df7a2b3656c7.jpg) |

**Number of Threads 2 ; Ramp-Up Period 10s**

|                                              Requests Summary                                               |                                                   Errors                                                    |
| :---------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
| ![3](https://user-images.githubusercontent.com/92669932/189543781-8e545531-a134-4dfd-b6bc-36b6539668b5.jpg) | ![4](https://user-images.githubusercontent.com/92669932/189543783-37624029-b0ea-4671-b5e7-e158453b6d7c.jpg) |

**Number of Threads 3 ; Ramp-Up Period 10s**

|                                              Requests Summary                                               |                                                   Errors                                                    |
| :---------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
| ![3](https://user-images.githubusercontent.com/92669932/189543781-8e545531-a134-4dfd-b6bc-36b6539668b5.jpg) | ![2](https://user-images.githubusercontent.com/92669932/189543499-17c168a2-5b32-4710-9bc0-df7a2b3656c7.jpg) |

**Number of Threads 4 ; Ramp-Up Period 10s**

|                                              Requests Summary                                               |                                                   Errors                                                    |
| :---------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
| ![3](https://user-images.githubusercontent.com/92669932/189543781-8e545531-a134-4dfd-b6bc-36b6539668b5.jpg) | ![2](https://user-images.githubusercontent.com/92669932/189543499-17c168a2-5b32-4710-9bc0-df7a2b3656c7.jpg) |

**Number of Threads 5 ; Ramp-Up Period 10s**

|                                              Requests Summary                                               |                                                    Errors                                                    |
| :---------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: |
| ![3](https://user-images.githubusercontent.com/92669932/189543781-8e545531-a134-4dfd-b6bc-36b6539668b5.jpg) | ![2](https://user-images.githubusercontent.com/92669932/189543499-17c168a2-5b32-4710-9bc0-df7a2b3656c7.jpg) |

**Number of Threads 6 ; Ramp-Up Period 10s**

|                                               Requests Summary                                               |                                                    Errors                                                    |
| :----------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: |
| ![3](https://user-images.githubusercontent.com/92669932/189543781-8e545531-a134-4dfd-b6bc-36b6539668b5.jpg) | ![2](https://user-images.githubusercontent.com/92669932/189543499-17c168a2-5b32-4710-9bc0-df7a2b3656c7.jpg) |

# Stress Testing

Stress Testing is a type of software testing that evaluates how the software responds under extreme conditions. It verifies how robust a system will be, and its response capabilities and error handling when it is subjected to conditions where its normal functioning can be compromised.

**Number of Threads 7 ; Ramp-Up Period 10s**

|                                              Requests Summary                                               |                                                   Errors                                                    |
| :---------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
| ![image](https://github.com/user-attachments/assets/3a506d9a-f188-4117-954a-3f536d20a477) | ![image](https://github.com/user-attachments/assets/f334d303-d442-42d7-b3d0-08c5dd69676c) |

**Number of Threads 8 ; Ramp-Up Period 10s**

|                                              Requests Summary                                               |                                                   Errors                                                    |
| :---------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
| ![image](https://github.com/user-attachments/assets/1804d555-c57e-4c01-bced-98f7bc92c099) | ![image](https://github.com/user-attachments/assets/b460ee62-dcf9-4860-8112-4f01a7a8bf42)
 |

**Number of Threads 9 ; Ramp-Up Period 10s**

|                                              Requests Summary                                               |                                                   Errors                                                    |
| :---------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
| ![image](https://github.com/user-attachments/assets/1804d555-c57e-4c01-bced-98f7bc92c099) | ![image](https://github.com/user-attachments/assets/b460ee62-dcf9-4860-8112-4f01a7a8bf42) |

# Spike Testing

Spike testing is a type of performance testing where the demand for an application is suddenly and drastically increased or decreased. Spike testing's objective is to ascertain how a software program will behave under highly variable traffic conditions.

**Number of Threads 15 ; Ramp-Up Period 10s**

|                                              Requests Summary                                               |                                                   Errors                                                    |
| :---------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
| ![image](https://github.com/user-attachments/assets/1804d555-c57e-4c01-bced-98f7bc92c099) | ![image](https://github.com/user-attachments/assets/b460ee62-dcf9-4860-8112-4f01a7a8bf42) |

# Endurance Testing

An application may be put through endurance testing to see if it can handle the processing load that will be placed on it over an extended period of time. Memory usage is tracked throughout endurance tests to identify potential issues.

**Start Threads count 6s ; Initial Delay 0s ; Start up Time 10s ; Hold load for 600s ; Shutdown Time 0s**

|                                              Requests Summary                                               |                                                   Errors                                                    |
| :---------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
| ![image](https://github.com/user-attachments/assets/1804d555-c57e-4c01-bced-98f7bc92c099) | ![image](https://github.com/user-attachments/assets/b460ee62-dcf9-4860-8112-4f01a7a8bf42) |

![image](https://github.com/user-attachments/assets/b5f214d4-ffad-4678-9b10-6bb886d2517a)


# Read Test Data from CSV file in Jmeter

- Create a CSV file in the test suite folder and add test data to it. <br/>

![image](https://github.com/user-attachments/assets/78ef4deb-2f32-404e-a04d-7a17c0fd4f40)


- Add a Config Element CSV Data Set Config in Jmeter. <br/>

![image](https://github.com/user-attachments/assets/ae43b23f-f0be-4b95-8e74-b9228ecde390)


- Configure ' CSV Data Set Config ' based on the need such as providing path of CSV file and variable names and other configs. <br/>

![image](https://github.com/user-attachments/assets/ddfc2fa3-770d-45a9-b5b4-256844840b8f)


- Run the test to see if data from the CSV file is read and populated in the results. <br/>

- Run the test to see if data from CSV file is read and populated in the results. <br/>

**Number of Threads 13 ; Ramp-Up Period 5s**

<p float="left">
  <img src="https://github.com/user-attachments/assets/c74dfdb2-2cb5-40f3-b960-6f2641bc8c85" width="49%" />   
  <img src="https://github.com/user-attachments/assets/ed50560c-6e99-4f40-a9a7-9be23f10e9eb" width="49%" />   
  <img src="https://github.com/user-attachments/assets/f5ac2bac-0b51-449e-9888-92a4df7b6142" width="49%" />    
  <img src="https://github.com/user-attachments/assets/61a3a21d-24e4-44c6-be05-9b9f1dedb053" width="49%" />     
</p>
