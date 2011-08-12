Ext.regModel('Contact', {
    fields: ['firstName', 'lastName']
});

Ext.setup({
    onReady: function() {
        new Ext.Button({
            text     : 'Open Local Search',
            renderTo : Ext.getBody(),
            width    : 220,
            handler  : function() {
                new Ext.touch.ux.SearchPanel({
                    floating : true,
                    width    : 400,
                    height   : 400,
                    centered : true,

                    searchFields : ['lastName', 'firstName'],

                    fieldConfig  : {
                        height      : 45,
                        placeHolder : 'Search...'
                    },

                    listConfig : {
                        itemTpl  : '{firstName} {lastName}',
                        grouped  : true,
                        indexBar : true,
                        store    : new Ext.data.JsonStore({
                            model   : 'Contact',
                            sorters : 'lastName',

                            getGroupString : function(record) {
                                return record.get('lastName')[0];
                            },

                            data: [
                                { firstName : 'Danielle', lastName : 'Collins'  },
                                { firstName : 'Mitchell', lastName : 'Simoens'  },
                                { firstName : 'Tommy',    lastName : 'Maintz'   },
                                { firstName : 'Rob',      lastName : 'Dougan'   },
                                { firstName : 'Ed',       lastName : 'Spencer'  },
                                { firstName : 'Jamie',    lastName : 'Avins'    },
                                { firstName : 'Aaron',    lastName : 'Conran'   },
                                { firstName : 'Dave',     lastName : 'Kaneda'   },
                                { firstName : 'Michael',  lastName : 'Mullany'  },
                                { firstName : 'Abraham',  lastName : 'Elias'    },
                                { firstName : 'Jay',      lastName : 'Robinson' }
                            ]
                        })
                    }
                }).show();
            }
        });

        new Ext.Button({
            text     : 'Open Remote Search',
            renderTo : Ext.getBody(),
            width    : 220,
            handler  : function() {
                new Ext.touch.ux.SearchPanel({
                    floating : true,
                    width    : 400,
                    height   : 400,
                    centered : true,

                    searchFields : ['lastName', 'firstName'],

                    fieldConfig  : {
                        height      : 45,
                        placeHolder : 'Search...'
                    },

                    listConfig : {
                        itemTpl  : '{firstName} {lastName}',
                        grouped  : true,
                        indexBar : true,
                        store    : new Ext.data.JsonStore({
                            model        : 'Contact',
                            autoLoad     : true,
                            remoteFilter : true,
                            sorters      : 'lastName',

                            proxy: {
                                type   : 'ajax',
                                url    : 'test.php',
                                reader : {
                                    type : 'json'
                                }
                            },

                            getGroupString : function(record) {
                                return record.get('lastName')[0];
                            }
                        })
                    }
                }).show();
            }
        });
    }
});