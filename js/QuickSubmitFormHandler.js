/**
 * @defgroup plugins_importexport_quickSubmit_js
 */
/**
 * @file js/QuickSubmitFormHandler.js
 *
 * Copyright (c) 2014-2023 Simon Fraser University
 * Copyright (c) 2000-2023 John Willinsky
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 * @class QuickSubmitFormHandler.js
 * @ingroup plugins_importexport_quickSubmit_js
 *
 * @brief Handle the quickSubmit form.
 */
(function($) {

	/** @type {Object} */
	$.pkp.plugins.importexport.quickSubmit =
			$.pkp.plugins.importexport.quickSubmit ||
			{ js: {} };



	/**
	 * @constructor
	 *
	 * @extends $.pkp.controllers.form.FormHandler
	 *
	 * @param {jQueryObject} $form the wrapped HTML form element.
	 * @param {Object} options form options.
	 */
	$.pkp.plugins.importexport.quickSubmit.js.QuickSubmitFormHandler =
			function($form, options) {

		this.parent($form, options);
		this.callbackWrapper(this.updateSchedulePublicationDiv_());

		$('#locale, #sectionId').change(function() {
			// Trick the form not to validate missing data before submitting
			$('input,textarea,select').filter('[required]').each(function() {
				$(this).removeAttr('required');
				$(this).removeClass('required');
			});

			// This submit is for relocalisation of the form
			$('#reloadForm').val('1');

			// Submit the form
			$('#quickSubmitForm').submit();
		});

	};
	$.pkp.classes.Helper.inherits(
			$.pkp.plugins.importexport.quickSubmit.js.QuickSubmitFormHandler,
			$.pkp.controllers.form.FormHandler);


	/**
	 * Callback to replace the element's content.
	 *
	 * @private
	 */
	$.pkp.plugins.importexport.quickSubmit.js.QuickSubmitFormHandler.prototype.
			updateSchedulePublicationDiv_ = function() {

		$('input[type=radio][name=articleStatus]').change(function() {
			if ($(this).is(':checked') && this.value == '0') {
				$('#schedulePublicationDiv').hide();
			} else if ($(this).is(':checked') && this.value == '1') {
				$('#schedulePublicationDiv').show();
			} else {
				$('#schedulePublicationDiv').hide();
			}
		});

		$('input[type=radio][name=articleStatus]').trigger('change');

		$('#issueId').change(function() {
			var val, array;
			val = /** @type {string} */ $('#issuesPublicationDates').val();
			array = JSON.parse(val);
			if (!array[$('#issueId').val()]) {
				$('#schedulingInformationDatePublished').hide();
			} else {
				$('input[name="datePublished"]').
						datepicker('setDate', array[$('#issueId').val()]);
				$('#ui-datepicker-div').hide();
				$('#schedulingInformationDatePublished').show();
			}
		});

		$('#issueId').trigger('change');
	};

	/**
	 * Height of the quickSubmit rich-text editors, in pixels.
	 *
	 * These override the rows-based height SiteHandler.js derives from the
	 * textarea's `rows` attribute, so changing `rows` in the template has no
	 * effect — change these instead.
	 */
	var EDITOR_HEIGHTS = {
		titleRichContent: 130,
		extendedRichContent: 220
	};

	/**
	 * Size one editor.
	 *
	 * Only the container is sized — TinyMCE flexes the content iframe into
	 * whatever the toolbar leaves over. This used to force the iframe to the
	 * full height as well, which pushed the content area down under the
	 * toolbar: the field rendered one visible line high but scrolled, and the
	 * placeholder sat half out of view.
	 *
	 * @param {jQuery} $editor The .tox-tinymce container.
	 * @param {Object} tinyMCEObject The editor instance.
	 * @param {number} height Total height in pixels.
	 */
	function resizeEditor($editor, tinyMCEObject, height) {
		$editor.css('height', height + 'px');
		if (tinyMCEObject && tinyMCEObject.theme && tinyMCEObject.theme.resizeTo) {
			tinyMCEObject.theme.resizeTo(null, height);
		}
	}

	$(document).on('tinyMCEInitialized', function(event, tinyMCEObject) {
		var $field = $('#' + $.pkp.classes.Helper.escapeJQuerySelector(tinyMCEObject.id));
		var $editor = $field.next('.tox-tinymce');
		if (!$editor.length) {
			return;
		}

		if ($field.hasClass('titleRichContent')) {
			resizeEditor($editor, tinyMCEObject, EDITOR_HEIGHTS.titleRichContent);
			return;
		}

		if ($field.hasClass('extendedRichContent')) {
			resizeEditor($editor, tinyMCEObject, EDITOR_HEIGHTS.extendedRichContent);
		}
	});

	/** @param {jQuery} $ jQuery closure. */
}(jQuery));
