/* 
 * crosslink tagging
 */
(function()
{
    var commandObject =
    {
        exec : function( editor ){
            var selected = editor.getSelection().getNative();
            editor.openDialog('crosslink');
        }
    };
    
    CKEDITOR.plugins.add( 'crosslink', {
    
        init : function( editor ) {
            var commandName = 'crosslink';
            editor.addCommand( commandName, commandObject );
            
            editor.ui.addButton( 'Crosslink', {
                label : editor.lang.crosslink.crosslink,
                command : commandName,
                icon: this.path + 'crosslink3.gif'
            } );
            
            CKEDITOR.dialog.add( commandName, this.path + 'dialogs/crosslinkdialog.js' );
        },
        
        lang : ['en', 'de'],

        requires : [ 'domiterator', 'ajax' ]
    } );
})();