public without sharing class PSEasyPostTestHandler implements PSEasyPostHandlerInterface {
    public void process(String recordId, String data) {
       System.debug('PSEasyPostTestHandler:process() invoked...');

       Map<String, Object> resp = (Map<String, Object>)JSON.deserializeUntyped(data);
       System.debug('data = ' + JSON.serialize(resp));
    }
}