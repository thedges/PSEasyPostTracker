({
     refreshView: function(component, event) {
        console.log('refreshView invoked...');
        $A.get('e.force:refreshView').fire();
    }
})