public without sharing class PSEasyPostTestHandler implements PSEasyPostHandlerInterface {
    private Map<String, String> statusMap = new Map<String, String> {
        'pre_transit' => 'Vendor Accepted',
        'in_transit' => 'Order Fulfilled',
        'out_for_delivery' => 'Order Shipped',
        'delivered' => 'Delivered'
    };

    public PSEasyPostTestHandler()
    {

    }

    public void process(String recordId, String data) {
        System.debug('PSEasyPostTestHandler:process() invoked...');

        Map<String, Object> resp = (Map<String, Object>)JSON.deserializeUntyped(data);
        System.debug('data = ' + JSON.serialize(resp));

        String status = (String)resp.get('status');
        if (statusMap.containsKey(status))
        {
            Id recId = Id.valueOf(recordId);

            SObject sobj = recId.getSobjectType().newSObject(recId);
            sobj.put('Status', (String)statusMap.get(status));
            update sobj;
        }
    }
}