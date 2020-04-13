global without sharing class PSEasyPostController {
    @AuraEnabled
    global static String getTracker(String trackId, String carrier)
    {
        EasyPost__mdt easyPostKeys = [SELECT Production_API_Key__c, Test_API_Key__c FROM EasyPost__mdt WHERE DeveloperName = 'EasyPost'];
        String apiKey;
        if (trackId.startsWith('EZ'))
        {
          apiKey = easyPostKeys.Test_API_Key__c;
        }
        else {
          apiKey = easyPostKeys.Production_API_Key__c;
        }

        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://api.easypost.com/v2/trackers');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json;charset=UTF-8');

        if (carrier != null)
        {
            req.setBody('{"tracker": {"tracking_code": "' + trackId + '","carrier": "' + carrier + '"}}');
        }
        else {
            req.setBody('{"tracker": {"tracking_code": "' + trackId + '"}}');
        }

        Blob headerValue = Blob.valueOf(apiKey + ':');
        String authorizationHeader = 'Basic ' + EncodingUtil.base64Encode(headerValue);
        req.setHeader('Authorization', authorizationHeader);

        Http http = new Http();
        HTTPResponse res = http.send(req);

        return res.getBody();
    }

    @AuraEnabled
    global static String getRecordData(String recordId, String trackFieldName, String carrierFieldName)
    {
        try
        {
            Map<String, Object> resp = new Map<String, Object>();

            ////////////////////////////////////
            // get object name from record id //
            ////////////////////////////////////
            String sObjName = Id.valueOf(recordId).getSObjectType().getDescribe().getName();
           
            /////////////////////
            // get record data //
            /////////////////////
            String soqlStr = 'SELECT ' + trackFieldName + ', ' + carrierFieldName + ' FROM ' + sObjName + ' WHERE Id = \'' + recordId + '\'';
            SObject rec = Database.query(soqlStr);

            if (rec != null)
            {
              resp.put('trackId', (String)getSobjectValue(rec, trackFieldName));
              resp.put('carrier', (String)getSobjectValue(rec, carrierFieldName));
            }

            return JSON.serialize(resp);

        }
        catch (Exception e)
        {
            String err = e.getTypeName() + ' - ' + e.getMessage() + ' [Line: ' + e.getLineNumber() + ']';
            System.debug(err);
            throw new  AuraHandledException(err);
        }

    }

    public static Object getSobjectValue(SObject obj, String fieldname)
    {
        Object retVal;

        if (fieldname.indexOf('.') != -1)
        {
            List<String> flds = fieldname.split('\\.');
            Integer i=1;

            for (String fld : flds)
            {
                if (obj == null) return null;

                if (i++ == flds.size())
                {
                    retVal = obj.get(fld);
                }
                else {
                    obj = (SObject)obj.getSObject(fld);
                }
            }

        }
        else {
            retVal = obj.get(fieldname);
        }

        return retVal;
    }

}