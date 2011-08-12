Ext.ns('Ext.touch.ux');

Ext.touch.ux.SearchPanel = Ext.extend(Ext.Panel, {
    layout : {
        type  : 'vbox',
        align : 'stretch'
    },

    /**
     * @cfg {String} mode
     * The mode of the {@link Ext.data.Store} ('local' or 'remote'). Defaults to remoteFilter on {@link Ext.data.Store}
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
            items : me.buildItems()
        });

        Ext.touch.ux.SearchPanel.superclass.initComponent.call(me);

        me.on({
            beforesearch : me.onBeforeSearch,
            search       : me.onSearch
        });

        me.getField().on('keyup', me.handleTextChange, me);
    },

    buildItems: function() {
        var me    = this,
            field = me.fieldConfig || {},
            list  = me.listConfig || {};

        Ext.applyIf(field, {
            xtype     : 'textfield',
            lastValue : ''
        });

        Ext.applyIf(list, {
            xtype : 'list',
            flex  : 1
        });

        return [
            field,
            list
        ];
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