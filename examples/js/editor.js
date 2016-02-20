/**
 * jsPDFEditor
 * @return {[type]} [description]
 */
var jsPDFEditor = function() {
	
	var editor;

	var demos = {
		'custom-expose-real-estate.js': 'Custom: Expose "Real Estate"',
		'custom-invitations-revised.js': 'Custom: Invitations (Revised)',
		'custom-invitations.js': 'Custom: Invitations',
        'custom-timetable-revised.js': 'Custom: Timetable (Revised)',
        'custom-timetable.js': 'Custom: Timetable',
		'custom-voucher.js': 'Custom: Voucher',

		'images.js': 'Images',
		'font-faces.js': 'Font faces',
		'from-html.js': 'HTML Renderer (Early stages)',
		'two-page.js': 'Two page Hello World',
		'circles.js': 'Circles',
		'font-size.js': 'Font sizes',
		//'kitchen-sink.js': 'Kitchen Sink', // @TODO
		'landscape.js': 'Landscape',
		'lines.js': 'Lines',
		'rectangles.js': 'Rectangles',
		'string-splitting.js': 'String Splitting',
		'text-colors.js': 'Text colors',
		'triangles.js': 'Triangles',
		'user-input.js': 'User input'
		
	};

	var aceEditor = function() {
		editor = ace.edit("editor");
		editor.setTheme("ace/theme/twilight");
		//editor.setTheme("ace/theme/ambiance");
		editor.getSession().setMode("ace/mode/javascript");
		
		var timeout = setTimeout(function(){ }, 0);

		editor.getSession().on('change', function() {
			// Hacky workaround to disable auto refresh on user input
			if ($('#auto-refresh').is(':checked') && $('#template').val() != 'user-input.js') {
				clearTimeout(timeout);
				timeout = setTimeout(function() {
					jsPDFEditor.update();

				}, 500);
			}

		});
	};

	var populateDropdown = function() {
		var options = '';
		for (var demo in demos) {
			options += '<option value="' + demo + '">' + demos[demo] + '</option>';
		}
		$('#template').html(options).on('change', loadSelectedFile);

	};

	var loadSelectedFile = function() {
		if ($('#template').val() == 'user-input.js') {
			$('.controls .checkbox').hide();
			$('label[for=auto-refresh]').addClass('disabled');
			jsPDFEditor.update(true);
		} else {
			$('.controls .checkbox').show();
			$('label[for=auto-refresh]').removeClass('disabled');
		}


		$.get('examples/js/' + $('#template').val(), function(response) {
			editor.setValue(response);
			editor.gotoLine(0);

			// If autorefresh isn't on, then force it when we change examples
			if (! $('#auto-refresh').is(':checked')) {
				jsPDFEditor.update();
			}

		}).error(function() {

			$('.template-picker').html('<p class="source">More examples in <b>examples/js/</b>. We can\'t load them in automatically because of local filesystem security precautions.</p>');

			// Fallback source code
			var source = "ERROR";
			editor.setValue(source);
			editor.gotoLine(0);
		});
	};

	var initAutoRefresh = function() {
		
		$('.run-code').hide();
		
		$('#auto-refresh').on('change', function() {
			if ($('#auto-refresh').is(':checked')) {
				$('label[for=auto-refresh]').addClass('uk-active');
				$('.run-code').hide();
				jsPDFEditor.update();
			} else {
				$('label[for=auto-refresh]').removeClass('uk-active');
				$('.run-code').show();
			}
		});

		$('.run-code').click(function() {
			jsPDFEditor.update();
			return false;
		});
	};

	var initDownloadPDF = function() {
		$('.download-pdf').click(function(){
			eval(editor.getValue());

			var file = demos[$('#template').val()];
			if (file === undefined) {
				file = 'demo';
			}
			doc.save(file + '.pdf');
		});
		return false;
	};

	return {
		/**
		 * Start the editor demo
		 * @return {void}
		 */
		init: function() {

			// Init the ACE editor
			aceEditor();

			populateDropdown();
			loadSelectedFile();
			// Do the first update on init
			jsPDFEditor.update();

			initAutoRefresh();

			initDownloadPDF();
		},
		/**
		 * Update the iframe with current PDF.
		 *
		 * @param  {boolean} skipEval If true, will skip evaluation of the code
		 * @return
		 */
		update: function(skipEval) {
			setTimeout(function() {
				if (! skipEval) {
					eval(editor.getValue());
				}
				
				if(!doc)
					var doc = undefined;

				if (doc !== undefined) {
					var string = doc.output('datauristring');
					$('.preview-pane').attr('src', string);
				}
			}, 0);
		}
	};

}();

$(document).ready(function() {
	jsPDFEditor.init();
});
