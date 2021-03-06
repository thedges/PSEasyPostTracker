import {LightningElement, api, track, wire} from 'lwc';
import {loadStyle, loadScript} from 'lightning/platformResourceLoader';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {getRecord} from 'lightning/uiRecordApi';
import APP_RESOURCES from '@salesforce/resourceUrl/PSEasyPost';
import getRecordData from '@salesforce/apex/PSEasyPostController.getRecordData';
import getTracker from '@salesforce/apex/PSEasyPostController.getTracker';

export default class PsEasyPostTracker extends LightningElement {
  @api recordId;
  @api loadingMessage = 'Tracking data is loading...';
  @api trackFieldName = '';
  @api carrierFieldName = '';
  @api showDetails = false;
  @api handlerName;
  @track initialized = false;
  @track data;
  @track errorMsg = null;
  trackId = '';
  carrier = '';
  refreshIcon = APP_RESOURCES + '/RefreshIcon.png';

  //@wire(getRecord, { recordId: '$recordId', fields: ['Tracker_Number__c'] })
  @wire(getRecord, { recordId: '$recordId', layoutTypes: ['Full'], modes: ['View'] })
  wiredObject({ error, data }) {
          console.log('record was updated');

          if (data)
          {
            console.log('record_data=' + JSON.stringify(data));

            console.log('carrier=' + this.carrier);
            console.log('trackerId=' + this.trackId);
            console.log('carrierFieldName=' + data.fields[this.carrierFieldName].value);
            console.log('trackFieldName=' + data.fields[this.trackFieldName].value);

            if (data.fields[this.carrierFieldName].value != this.carrier ||
              data.fields[this.trackFieldName].value != this.trackId)
            {
              this.refresh();
            }
          }
  }

  get initializing() {
    return (this.errorMsg == null && this.initialized == false ? true : false);
  }

  get ready() {
    return (this.errorMsg == null && this.initialized == true ? true : false);
  }

  get error() {
    return (this.errorMsg != null ? true : false);
  }

  connectedCallback () {
    var self = this;

    Promise.all ([
      loadStyle (this, APP_RESOURCES + '/bootstrap-ns.css'),
      loadStyle (this, APP_RESOURCES + '/clientCSS.css'),
      loadStyle (this, APP_RESOURCES + '/css/all.css'),
      loadScript (this, APP_RESOURCES + '/moment.min.js'),
    ])
    .then (() => {
      return self.refresh ();
    });
    /*
      .then (() => {
        return self.loadRecordData ();
      })
      .then (() => {
        return self.loadTrackerData ();
      })
      .catch (error => {
        self.handleError (error);
      });
      */
      
  }

  loadRecordData () {
    console.log ('loadRecordData...');
    console.log('recordId=' + this.recordId);

    return getRecordData ({
      recordId: this.recordId,
      trackFieldName: this.trackFieldName,
      carrierFieldName: this.carrierFieldName,
    })
    .then (result => {
      console.log ('getRecorData = ' + result);
      var recInfo = JSON.parse (result);
      this.trackId = recInfo.trackId;
      this.carrier = recInfo.carrier;

      if (this.trackId == null || this.carrier == null)
      {
        this.errorMsg = 'No tracking information provided!';
        throw new Error("Tracking ID and Carrier must be provided!");
        //reject(new Error('Tracking ID and Carrier must be provided!'));
      }
    });
  }

  loadTrackerData () {
    return getTracker ({
      recordId: this.recordId,
      trackId: this.trackId,
      carrier: this.carrier,
      handlerName: this.handlerName
    })
    .then (result => {
      console.log ('data=' + result);

      const resp = JSON.parse (result);

      if (resp.error == null)
      {

      ////////////////////////////////////////////////
      // build JSON structure to render status page //
      ////////////////////////////////////////////////
      var info = {};
      info.trackId = resp.tracking_code;
      info.carrier = resp.carrier;

      if (resp.updated_at != null) {
        info.lastUpdated = moment (resp.updated_at).format (
          'MMMM DD h:mm:ss a'
        );
      } else {
        info.lastUpdated = '';
      }

      info.deliveryLabel = 'Estimated Delivery Date';
      if (resp.est_delivery_date != null) {
        info.deliveryDate = moment (resp.est_delivery_date).format (
          'dddd MMMM DD'
        );
      } else {
        info.deliveryDate = '';
      }

      info.progressClass = 'twbs progress-bar bg-secondary';
      info.dotClass = 'twbs secondary';
      info.deliveryDateClass = 'twbs est-delivery-date text-secondary';

      info.preTransitDotClass = 'twbs dot state-0';
      info.inTransitDotClass = '';
      info.outForDeliveryDotClass = '';
      info.deliveredDotClass = '';

      if (resp.status == 'in_transit') {
        info.progressStyle = 'width: 33%;';
        info.preTransitClass = 'twbs state-label state-0 past-state';
        info.inTransitClass = 'twbs state-label state-1 current-state';
        info.outForDeliveryClass = 'twbs state-label state-2 future-state';
        info.deliveredClass = 'twbs state-label state-3 future-state';
        info.inTransitDotClass = 'twbs dot state-1';
      } else if (resp.status == 'out_for_delivery') {
        info.progressStyle = 'width: 66%;';
        info.preTransitClass = 'twbs state-label state-0 past-state';
        info.inTransitClass = 'twbs state-label state-1 past-state';
        info.outForDeliveryClass = 'twbs state-label state-2 current-state';
        info.deliveredClass = 'twbs state-label state-3 future-state';
        info.inTransitDotClass = 'twbs dot state-1';
        info.outForDeliveryDotClass = 'twbs dot state-2';
      } else if (resp.status == 'delivered') {
        info.progressStyle = 'width: 100%;';
        info.preTransitClass = 'twbs state-label state-0 past-state';
        info.inTransitClass = 'twbs state-label state-1 past-state';
        info.outForDeliveryClass = 'twbs state-label state-2 past-state';
        info.deliveredClass = 'twbs state-label state-3 current-state';
        info.progressClass = 'twbs progress-bar bg-success';
        info.dotClass = 'twbs success';
        info.deliveryDateClass = 'twbs est-delivery-date text-success';
        info.inTransitDotClass = 'twbs dot state-1';
        info.outForDeliveryDotClass = 'twbs dot state-2';
        info.deliveredDotClass = 'twbs dot state-3';
      } else {
        info.progressStyle = 'width: 0%;';
        info.preTransitClass = 'twbs state-label state-0 current-state';
        info.inTransitClass = 'twbs state-label state-1 future-state';
        info.outForDeliveryClass = 'twbs state-label state-2 future-state';
        info.deliveredClass = 'twbs state-label state-3 future-state';
      }

      info.carrierStyle = 'twbs mb-2 carrier-img mt-6 mt-md-0 ' + resp.carrier;

      info.status = resp.status;
      info.statusDetail = resp.status_detail;
      info.weight = resp.weight;
      info.originLocation = resp.carrier_detail.origin_location;
      info.destinationLocation = resp.carrier_detail.destination_location;

      var trackList = [];

      var tmpDate;
      var prevDate;
      var num = 1;

      for (var i = resp.tracking_details.length - 1; i >= 0; i--) {
        var trackItem = {};
        var tr = resp.tracking_details[i];
        var m;

        if (tmpDate == null) {
          m = moment (tr.datetime);

          tmpDate = m.format ('MMMM DD, YYYY');
          prevDate = tmpDate;

          var dateItem = {};
          dateItem.header = true;
          dateItem.info = tmpDate;
          dateItem.num = num++;
          trackList.push (dateItem);
        } else {
          m = moment (tr.datetime);
          tmpDate = m.format ('MMMM DD, YYYY');
          if (tmpDate != prevDate) {
            prevDate = tmpDate;
            var dateItem = {};
            dateItem.header = true;
            dateItem.info = tmpDate;
            dateItem.num = num++;
            trackList.push (dateItem);
          }
        }

        if (tr.status == 'delivered') {
          info.deliveryLabel = 'Delivered On';
          info.deliveryDate = moment (tr.datetime).format ('dddd MMMM DD');
        }

        trackItem.header = false;
        trackItem.time = m.format ('h:mma');
        trackItem.msg = tr.message;
        trackItem.num = num++;

        trackItem.iconClass = 'twbs font-size-h3 px-3 px-lg-4 far fa-circle';
        if (tr.status == 'pre_transit' && tr.status_detail == 'label_created') {
          trackItem.iconClass =
            'twbs font-size-h3 px-3 px-lg-4 fas fa-barcode text-secondary';
        } else if (
          tr.status == 'out_for_delivery' &&
          tr.status_detail == 'out_for_delivery'
        ) {
          trackItem.iconClass =
            'twbs font-size-h3 px-3 px-lg-4 far fa-clock text-secondary';
        } else if (tr.status == 'delivered') {
          trackItem.iconClass =
            'twbs font-size-h3 px-3 px-lg-4 far fa-check-circle text-success';
        }

        if (tr.tracking_location.city != null) {
          trackItem.location =
            tr.tracking_location.city + ', ' + tr.tracking_location.state;
        } else {
          trackItem.location = null;
        }
        trackList.push (trackItem);
      }

      info.trackingDetails = trackList;

      console.log ('info=' + JSON.stringify (info));

      this.data = info;

      this.initialized = true;

      this.dispatchEvent(new CustomEvent('refreshview'));
    } 
    else if (resp.error != null && resp.error.message == 'A duplicate request is currently in-flight')
    {

    } 
    else
    {
      this.errorMsg = 'Error occurred loading tracking data';

      const event = new ShowToastEvent ({
        title: resp.code,
        message: resp.error.message,
        variant: 'error',
        mode: 'pester',
      });
      this.dispatchEvent (event);
    }
    });
    /*
      .catch (error => {
        self.handleError (error);
      });
      */
  }

  onProgressClick () {
    console.log ('onProgressClick...');
    this.showDetails = !this.showDetails;
  }

  refresh () {
    console.log ('refresh the data...');

    this.initialized = false;
    //this.loadTrackerData ();

    Promise.all ([this.loadRecordData ()])
      .then (() => {
        return this.loadTrackerData ();
      })
      .catch (error => {
        this.handleError (error);
      });

  }

  handleToggleSection (event) {
    this.activeSectionMessage =
      'Open section name:  ' + event.detail.openSections;
  }

  handleError (err) {
    console.log ('error=' + err);
    console.log ('type=' + typeof err);

    //this.initialized = true;

    const event = new ShowToastEvent ({
      title: err.name,
      message: err.message,
      variant: 'error',
      mode: 'pester',
    });
    this.dispatchEvent (event);
  }
}