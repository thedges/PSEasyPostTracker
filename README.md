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

And here is a sample configuration for a PSWheelTemplate:

![alt text](https://github.com/thedges/PSEasyPostTracker/blob/master/PSEasyPostTrackerConfig.png "PSEasyPostTrackerConfig")
<img src="https://github.com/thedges/PSEasyPostTracker/blob/master/PSEasyPostTrackerConfig.png" height="42" width="42"></img>

# Setup Instructions
Here are steps to setup and configure this component:
  * Install the component per the __Deploy to Salesforce__ button below. 
  * Assign the __PSWheel__ permission set to any user that will use the PSWheel component.
  * Navigate to the __PSWheelTemplate__ tab
    - Create a __PSWheelTemplate__ record and provide unique name. Fill out the record field options per above definitions.
    - Create 1-to-many __PSWheelItemDef__ records to define configuration of all the nodes of the wheel. Fill out the record field options per above definitions.
  * Edit the record page for the object you want to place the wheel component on. Drag the __PSWheelAura__ component to area on the page. In the configuration options for the component, pick the template name you defined above.
  * That is it.

<a href="https://githubsfdeploy.herokuapp.com">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>
