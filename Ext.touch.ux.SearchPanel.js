Ext.ns('Ext.touch.ux');

Ext.touch.ux.SearchPanel = Ext.extend(Ext.Panel, {
    layout : 'fit',

    /**
     * @cfg {String} mode
     * The mode of the {@link Ext.data.Store} ('local' or 'remote'). Defaults to remoteFilter on {@link Ext.data.Store}
     */
    /**
     * @cfg {Object} dockConfig
     * A configuration Object of {@link Ext.Toolbar} that will hold the field.
     * Defaults to:
     * {
     *     xtype : 'toolbar',
     *     dock  : 'top'
     * }
     */
    /**
     * @cfg {Object} fieldConfig
     * A configuration Object of {@link Ext.form.Text}.
     * Defaults to:
     * {
     *     xtype : 'textfield',
     *     flex  : 1
     * }
     */
    /**
     * @cfg {Object} listConfig
     * A configuration Object of {@link Ext.List}.
     * Defaults to:
     * {
     *     xtype : 'list'
     * }
     */
    /**
     * @cfg {Array} searchFields
     * An Array of field names to search
     */
    searchFields : [],

    initComponent: function() {
        var me = this;

        me.addEvents(
            'beforesearch',
            'search'
        );

        Ext.apply(me, {
            dockedItems : me.buildDocks(),
            items       : me.buildItems()
        });

        Ext.touch.ux.SearchPanel.superclass.initComponent.call(me);

        me.on({
            beforesearch : me.onBeforeSearch,
            search       : me.onSearch
        });

        me.getField().on('keyup', me.handleTextChange, me);
    },

    buildDocks: function() {
        var me    = this,
            dock  = me.dockConfig || {},
            field = me.fieldConfig || {};

        Ext.applyIf(field, {
            xtype     : 'textfield',
            flex      : 1,
            lastValue : ''
        });

        Ext.applyIf(dock, {
            xtype : 'toolbar',
            dock  : 'top',
            items : field
        });

        return dock;
    },

    buildItems: function() {
        var me   = this,
            list = me.listConfig || {};

        Ext.applyIf(list, {
            xtype : 'list'
        });

        return list;
    },

    onBeforeSearch: function(panel, field, newValue, oldValue) {
        return newValue !== oldValue;
    },

    onSearch: function(panel, field, value) {
        var me     = this,
            mode   = me.mode,
            fields = panel.searchFields,
            store  = panel.getStore(),
            remote = mode ? mode === 'remote' : store.remoteFilter;

        store.clearFilter();

        if (remote) {
            me.doRemoteSearch(store, fields, value);
        } else {
            me.doLocalSearch(store, fields, value);
        }
    },

    doRemoteSearch: function(store, fields, value) {
        var fNum    = fields.length,
            f       = 0,
            filters = [],
            length  = value.length,
            blank   = length == 0,
            field, filter;

        if (!blank) {
            for (; f < fNum; f++) {
                field  = fields[f];
                filter = {
                    property : field,
                    value    : value
                };

                filters.push(filter);
            }
        }

        store.filter(filters);
    },

    doLocalSearch: function(store, fields, value) {
        var fNum = fields.length,
            f, field, str, match;

        store.filterBy(function(record) {
            f = 0;

            for (; f < fNum; f++) {
                field = fields[f];
                str   = record.get(field);
                match = str.search(new RegExp(value, 'im')) >= 0;

                if (match) {
                    break;
                }
            }

            return match;
        });
    },

    handleTextChange: function(field, e) {
        var me        = this,
            value     = field.getValue(),
            lastValue = field.lastValue;

        if (me.fireEvent('beforesearch', me, field, value, lastValue) === false) {
            return;
        }

        field.lastValue = value;

        me.fireEvent('search', me, field, value);
    },

    /**
     * Returns the {@link Ext.data.Store} on the child {@link Ext.List}
     * @return {Ext.data.Store} store
     */
    getStore: function() {
        var list = this.getList();

        return list.getStore();
    },

    /**
     * Returns the child {@link Ext.form.Text}
     * @return {Ext.form.Text} field
     */
    getField: function() {
        return this.down('.textfield');
    },

    /**
     * Returns the child {@link Ext.List}
     * @return {Ext.List} list
     */
    getList: function() {
        return this.down('.list');
    }
});

Ext.reg('searchpanel', Ext.touch.ux.SearchPanel);