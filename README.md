# PSEasyPostTracker
THIS SOFTWARE IS COVERED BY [THIS DISCLAIMER](https://raw.githubusercontent.com/thedges/Disclaimer/master/disclaimer.txt).

This package contains a demo Lightning component for showing package shipment details. The component uses the [EasyPost](https://www.easypost.com/) API service and specifically utilizes their [Tracker API](https://www.easypost.com/docs/api#trackers) for retrieving shipment details and date/time activities. The approach I used was to see the default EasyPost tracker page and just scrape out the HTML in to a Lightning Web Component to show the same view. This required some "jiggering" of the original EasyPost HTML which is based on Bootstrap. 

The focus of the component is to be added to a record page that has 2 fields to drive the component. One field the carrier name and other is the carrier tracking id. Below is sample of the component in action.

![alt text](https://github.com/thedges/PSEasyPostTracker/blob/master/PSEasyPostTracker.gif "PSEasyPostTracker")


# Dependency

This component utilizes:
* [EasyPost](https://www.easypost.com/) API service
* [Moment.js](https://momentjs.com/) javascript date/time library
* [Bootstrap](https://getbootstrap.com/docs/4.4/getting-started/download/) which was included from the EasyPost HTML scrape

## Component Configuration
Here are the configuration options for PSEasyPostTracker component:

| Parameter  | Definition |
| ------------- | ------------- |
| Loading Message  | [Optional] A text string to show while the component loads the tracking info from EasyPost |
| Tracking ID Field API Name  | The field API name to use to retrieve the tracking number |
| Carrier Field API Name | The field API name to retrieve the carrier name |
| Show Tracking Details | Boolean/checkbox field to show tracking data/time details by default. Showing details can be toggled by clicking on progress bar or delivery date areas |
| Handler Class Name | [Optional] Name of Apex class that implement PSEasyPostHandlerInterface (used for customized logic) |

And here is a sample configuration for a PSEasyPostTracker:

<img src="https://github.com/thedges/PSEasyPostTracker/blob/master/PSEasyPostTrackerConfig.png" height="300" />

# Setup Instructions
Here are steps to setup and configure this component:
  * Go to [EasyPost](https://www.easypost.com/) and sign up for a free account.
     - Login to account in top-left of screen, click your username and select __API Keys__.
     - Note down your production and test API keys.
  * Install the PSEasyPostTracker component per the __Deploy to Salesforce__ button below. 
  * Next we need to configure your API keys that you retrieved above. 
    - Go to __Setup > Custom Code > Customer Metadata Types__ and select __Manage Records__ next to the __"EasyPost"__ entry.
    - Click New and create a new entry named __"EasyPost"__ (it must be named this exactly) and enter your production and test API keys.
  * For the SObject that you will place this component on, create two custom fields (these can be named whatever you like as you reference them in the component configuration):
    - __Carrier field__ - create a picklist field with following values (UPS, FedEx, USPS, DHL). EasyPost supports many more but I've mainly used FedEx and UPS for my testing.
    - __Tracking ID field__ - create a text field to store the carrier tracking id
  * Edit the record page for the object you want to place the wheel component on. Drag the __PSEasyPostTracker__ component to area on the page. Configure the component per the above defined parameters.
  * That is it.

<a href="https://githubsfdeploy.herokuapp.com">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>
