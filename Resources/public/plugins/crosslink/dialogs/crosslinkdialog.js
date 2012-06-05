(function() {
    function updateCategories(editor, widgetElement) {
        var container = widgetElement.getElement();
        var selectNode = $(container.$).find("select");
        selectNode.html('');
        CKEDITOR.ajax.load('/service/showconfig', function(response) {
            // eval is evil!
            var config = eval('(' + response + ')');
            for (crosslink in config.crosslinking) {
                var node = config.crosslinking[crosslink];
                selectNode.append($('<option>').text(node.label).val(node.entity));
            }
            
            // first event after loading
            editor.fire("categoryChanged", selectNode.val());
        });
    }
    
    function updateEntities(editor, widgetElement, value) {
        var container = widgetElement.getElement();
        var selectNode = $(container.$).find("select");
        selectNode.html('');
        CKEDITOR.ajax.load('/service/list/'+value, function(response) {
            // eval is evil!
            var entities = eval('(' + response + ')');
            for (entity in entities.data) {
                var node = entities.data[entity];
                selectNode.append($('<option>').text(node.name).val(node.id));
            }
        });
    }
    
    function getContents( editor ) {
    
        return [{
            label : editor.lang.crosslink.crosslink, 
            id : 'general', 
            elements : [{
                type : 'html',
                id : 'crosslink',
                html : '<div style="white-space:normal;width:340px;">'+editor.lang.crosslink.connect+'</div>'
            },{
                type : 'select',
                id : 'category',
                label : editor.lang.crosslink.type,
                items : [  ],
                onLoad : function() {
                    updateCategories(editor, this);
                },
                onChange : function() {
                    editor.fire("categoryChanged", this.getValue());
                },
                focus : function() {
                    this.getElement().focus();
                },
                commit : function() {
                    var value = this.getValue();
                    setTimeout( function() {
                        editor.fire( 'paste', {
                            'text' : "\n[[" + value
                        } );
                    }, 0 ); // first element to fire text
                }
            },{
                type : 'select',
                id : 'entity',
                label : editor.lang.crosslink.element,
                items : [ ],
                setup : function() {
                    var widget = this;
                    editor.on("categoryChanged", function( event ) {
                        updateEntities(editor, widget, event.data);
                    })
                },
                commit : function() {
                    var value = this.getValue();
                    setTimeout( function() {
                        editor.fire( 'paste', {
                            'text' : ":" + value + "]] "
                        } );
                    }, 15 ); // litte bit delayed
                }
            }]
        }];
    }
    
    CKEDITOR.dialog.add( 'crosslink', function( editor )
    {
        return {
            title : editor.lang.crosslink.crosslink,

            minWidth : CKEDITOR.env.ie && CKEDITOR.env.quirks ? 368 : 350,
            minHeight : 140,

            onShow : function(){
                this.setupContent();
            },
            onOk : function(){
                this.commitContent();
            },

            contents : getContents( editor )

        };
    });
})();
