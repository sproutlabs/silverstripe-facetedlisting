jQuery(function($) {
	var form   = $("#Form_FilterForm");
	var facets = $("#listing-facets");
	
	/**
	 * Sends the contents of the facet selects to the server and loads the
	 * resulting facet data.
	 */
	var loadFromServer = function() {
		var selects = form.find("select");
		var data    = selects.serialize();
		var url     = form.metadata().facetsLink;

		form.addClass('loading');
		selects.attr('disabled', 'disabled');

		$.get(url, data, function(data) {
                  
                   //ADDED because when we extend teh FacetedListingController twice the JSON was being returned as a strong  
                    if((typeof data) == 'string' ) {
                        var data =  JSON.parse(data);
                         //window.console.log(data);
                         //window.console.log(typeof data);
                            
                    }
                    
                    
			loadFromObj(data);
			selects.removeAttr('disabled');
			form.removeClass('loading');
		});
	};

	/**
	 * Loads faceting data from a JSON set.
	 */
	var loadFromObj = function(data) {
                             
                    
		$.each(data, function(name, options) {
                    
              
                    
                    
                    
			var select   = $("select[name='" + name + "']");
			var selected = select.val();

			select.html(select.data("original").html());
			select.val(selected);

			select.find("option").each(function() {
				var val = $(this).val();

				if (!val) {
					return;
				} else if (val in options) {
					$(this).text(options[$(this).val()]);
				} else {
					$(this).remove();
				}
			});
		});
	};
	
	form.find("select").each(function() {
		$(this).data("original", $(this).clone());
		$(this).change(loadFromServer);
	});

	form.find("button[type='reset']").click(function() {
		form.find("input.text").val("");
		form.find("select").each(function() {
			$(this).html($(this).data("original").html()).val("");
		});
	});

	if (facets.length) {
		loadFromObj(eval("(" + facets.html() + ")"));
	}
});