/*
	Copyright (C) 2011  Minko Gechev (http://mgechev.com/)
	This program comes with ABSOLUTELY NO WARRANTY; for details type http://www.gnu.org/licenses/gpl-3.0.html.
	This is free software, and you are welcome to redistribute it
	under certain conditions; type http://www.gnu.org/licenses/gpl-3.0.html for details.
*/
//Namespace function
var root = root || {};
root.namespace = function (namespace) {
	'use strict';
	var split = namespace.split('.'),
		key,
		element = root,
		i = 0,
		max = split.length;
	for (i = 0; i < max; i++) {
		if (element[split[i]] === undefined) {
			element[split[i]] = {};
		}
		element = element[split[i]];
	}
	return element;
}

//Form
var form = root.namespace('mgechev.com.form');
root.mgechev.com.form = (function($) {
		
		var contactContentBackup = {};
		var config = {
			contactInputsClass: 'contactInput',
			contactInputsFocus: 'contactInputFocus',
			emailId : 'emailInput',
			contentId : 'contentInput',
			subjectId : 'subjectInput',
			messageContainerId: 'infoMessage',
			sendButtonId: 'sendButton',
			postUrl: './mail.php',
			successStyle: 'successMessage',
			errorStyle: 'errorMessage',
			infoAnimationDuration: 350,
			emailRegex: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
		}
		return {
			init: function() {
				var contactInputs = $('.' + config.contactInputsClass);
				var self = this;
				contactInputs.focus(function() {
					var id = $(this).attr('id');
					if (!contactContentBackup[id]) {
						contactContentBackup[id] = $(this).val();
						$(this).val('');
						$(this).addClass(config.contactInputsFocus);
					} else {
						if (contactContentBackup[id] === $(this).val()) {
							$(this).val('');
							$(this).addClass(config.contactInputsFocus);
						}
					}
					self.hideMessage();
				});
									
				contactInputs.blur(function() {
					var id = $(this).attr('id');
					if (contactContentBackup[id]) {
						if ($(this).val() === '') {
							$(this).val(contactContentBackup[id]);
							$(this).removeClass(config.contactInputsFocus);
						}
					}
				});
				
				var sendButton = $('#' + config.sendButtonId);
				sendButton.click(function() {
					if (self.validateForm(true)) {
						self.send();
					}
				});
			},
			
			send: function() {
				var email = $('#' + config.emailId).val(),
					subject = $('#' + config.subjectId).val(),
					content = $('#' + config.contentId).val(),
					sendButton = $('#' + config.sendButtonId),
					self = this;
				$.ajax({
					type: 'post',
					url: config.postUrl,
					data: {email: email, 
						   content: content,
						   subject: subject
					},
					success: function(info) {
						info = $.parseJSON(info);
						if (!info) {
							self.displayMessage('Няма връзка със сървъра', true);
							return;
						}
						if (info.error) {
							self.displayMessage(info.error, true);
						} else {
							self.displayMessage(info.success, false);
							sendButton.unbind('click');
						}
					}
				});
			},
			
			validateForm: function(showMessage) {
				var email = $('#' + config.emailId).val(),
					subject = $('#' + config.subjectId).val(),
					content = $('#' + config.contentId).val(),
					error = undefined;
				if (!email.match(config.emailRegex)) {
					error = 'Невалиден e-mail.';
				}
				if (content.length < 10) {
					error = 'Твърде кратко съдържание.';
				}
				if (subject.length > 0 && 
					subject.length < 5) {
					error = 'Твърде кратко заглавие.';
				}
				if (showMessage && error !== undefined) {
					this.displayMessage(error, true);
				}
				if (error !== undefined) 
					return false;
				else 
					return true;
			},
			
			displayMessage: function(message, isError) {
				var container = $('#' + config.messageContainerId);
				container.fadeTo(0, 0.01);
				container.css('visibility', 'visible');
				container.html('<center><strong>' + message + '</strong></center>');
				if (isError) {
					container.removeClass(config.successStyle);
					container.addClass(config.errorStyle);
				} else {
					container.addClass(config.successStyle);
					container.removeClass(config.errorStyle);			
				}
				container.fadeTo(config.infoAnimationDuration, 1);
			},
			
			hideMessage: function() {
				var container = $('#' + config.messageContainerId);
				container.fadeTo(config.infoAnimationDuration, 0.01, function() {
					container.css('visibility', 'hidden');
				});
				container.html('');
			}
			
		}
		
})(jQuery);
	
//Preloader
var preloader = root.namespace('mgechev.com.preloader');	
root.mgechev.com.preloader = (function($) {
	var loadingPointsTimeout;
	var myself = root.mgechev.com.preloader;
	var config = {
			documentFadeOutDuration: 0,
			documentFadeInDuration: 350,
			documentFadeToValue: 1,
			preloaderFadeToValue: 0.7,
			preloaderFadeInDuration: 0,
			preloaderFadeOutDuration: 350,			
			preloaderId: 'preloader',
			preloaderParent: 'html',
			contentToHide: 'body',
			toAnimatePoints: true,
			imageDestination: './images/loading.gif',
			pointsAnimationDuration: 300,
			loadingTextContainer: 'loadingHeader',
			preloaderChildId: 'loading',
			loadingText: 'Loading'
	};
	return {
					
		init: function() {
			var self = this;
			$(window).load(function() {
				self.removePreloader();
			});
			this.addPreloader();
		},
		
		removePreloader: function() {
			$(config.contentToHide).children().fadeTo(config.documentFadeInDuration, 1);				
			$('#' + config.preloaderId).fadeOut(config.preloaderFadeOutDuration, function() {
				$('#' + config.preloaderId).remove();
			});
			clearTimeout(loadingPointsTimeout);
		},
		
		addPreloader: function() {				
			$(config.contentToHide).children().fadeTo(config.documentFadeOutDuration, config.documentFadeToValue);
			$(config.preloaderParent).prepend('<div id="' + config.preloaderId + '">');
			$('#' + config.preloaderId).html(
				'<div id="' + config.preloaderChildId + '" style="width: 200px;">' +
				'<h1 id="' + config.loadingTextContainer + '" style="color: black">' +
				'<img src="' + config.imageDestination + '" alt=""> ' + config.loadingText +
				'</h1></div>'
			);
			this.addStyles();
			$('#' + config.preloaderId).fadeTo(config.preloaderFadeInDuration, config.preloaderFadeToValue);
			this.centerPreloader();
			
			if (config.toAnimatePoints)
				this.loadingPoints();
		},
		
		centerPreloader: function() {
			var verticalMiddle = 
			parseInt($(window).height()) / 2 - parseInt($('#' + config.preloaderChildId).height()) / 2;				
			$('#' + config.preloaderChildId).css('margin-top', verticalMiddle);				
			var horizontalMiddle = parseInt($(window).width()) / 2 - parseInt($('#' + config.preloaderChildId).width()) / 2;
			$('#' + config.preloaderChildId).css('margin-left', horizontalMiddle);
		},
		
		addStyles: function() {
			$('#' + config.preloaderId).css({
				height: $(document).height(),
				width: $(document).width(),
				background: '#fff',
				position: 'absolute',
				left: '0px',
				right: '0px'
			});
		},
		
		loadingPoints: function() {
			var self = this;
			loadingPointsTimeout = setTimeout(function() {
				self.loadingPoints();
			}, config.pointsAnimationDuration);				
			if ($('#' + config.loadingTextContainer).text().indexOf('.') < 0 ||
				$('#' + config.loadingTextContainer).text().indexOf('..') < 0 ||
			    $('#' + config.loadingTextContainer).text().indexOf('...') < 0) {
				$('#' + config.loadingTextContainer).append('.');
			} else if ($('#' + config.loadingTextContainer).text().indexOf('...') >= 0) {
				var loadingText = $('#' + config.loadingTextContainer).html();
				$('#' + config.loadingTextContainer).html(loadingText.substr(0, loadingText.length - 3));
			}
		}
	}	
})(jQuery);
