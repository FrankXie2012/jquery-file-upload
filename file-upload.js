// jquery-file-upload上传插件
// 参数：
// url: 文件传输网址
// dataType: 数据类型，例如json
// maxFileSize: 最大文件大小，以byte为单位
// add: function(){} 文件选择完成后的回调函数
// done: function(){} 文件上传完成后的回调函数


(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        // require.config({
        //     baseUrl: "bower_components/",
        //     paths: {
        //         "jquery": "jquery/dist/jquery.min",
        //         "ui-widget": "blueimp-file-upload/js/vendor/jquery.ui.widget",
        //         "jquery-iframe-transport": "blueimp-file-upload/js/jquery.iframe-transport",
        //         "jquery-file-upload": "blueimp-file-upload/js/jquery.fileupload",
        //         "semantic": "semantic/dist/semantic.min"
        //     }
        // });
        // define(['jquery', 'ui-widget', 'jquery-iframe-transport', 'jquery-file-upload', 'semantic'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.fn.uploadFile = function (options) {
        _clicks = 0;
        $(this).click(function(){
            _clicks += 1;
            $(this).siblings('#fileupload').trigger('click').fileupload({
                url: options.url,
                dataType: options.dataType || 'json',
                maxFileSize: options.maxFileSize || 100000000,
                // acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                add: function (e, data) {
                    // 添加一行上传记录
                    var _type = data.files[0].type.split('/')[0];
                    var _line = '<tr class="upload-details" id="line' + _clicks + '">';
                    if (_type == 'image') {
                        _line = _line +
                            '<td><img src="" class="file-preview" /></td>\
                            <td><span class="file-name"></span>　<span class="file-size"></span></td>';
                    } else {
                        _line = _line +
                            '<td><span class="file-name"></span></td>\
                            <td><span class="file-size"></span></td>';
                    }
                    _line = _line + '<td width="50%">\
                                        <div class="ui active indicating progress">\
                                            <div class="bar">\
                                                <div class="percents"></div>\
                                            </div>\
                                            <div class="label"></div>\
                                        </div>\
                                    </td>\
                                    <td><button class="file-operate blue ui button"></button></td>\
                                </tr>';
                    $(this).siblings('.upload-table').append(_line);
                    // 显示照片缩略图
                    if (data.files && data.files[0] && _type == 'image') {
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            $('#line' + _clicks + ' .file-preview').attr('src', e.target.result);
                            // 添加链接到缩略图和文件名
                            var _link = '<a href="' + e.target.result + '" target="_blank" title="' + data.files[0].name + '"></a>';
                            $('#line' + _clicks).find('img').wrap(_link);
                            $('#line' + _clicks).find('.file-name').wrap(_link);
                        }
                        reader.readAsDataURL(data.files[0]);
                    }
                    // 显示文件名称和大小
                    $('#line' + _clicks + ' .file-name').text(data.files[0].name);
                    $('#line' + _clicks + ' .file-size').text(formatFileSize(data.files[0].size));
                    // 上传文件
                    data.submit();
                    // 点击取消上传
                    $('#line' + _clicks + ' .file-operate').text('取消上传').addClass('orange').click(function(){
                        data.submit().abort();
                        $(this).parents('.upload-details').hide(1000).remove();
                    });
                    // 添加文件后的回调函数
                    options.add();
                },
                done: function (e, data) {
                    // 完成上传后，按钮文字颜色改变
                    $('#line' + _clicks + ' .file-operate').text('删除文件').addClass('red').click(function(){
                        data.submit().abort();
                        $(this).parents('.upload-details').remove();
                    });
                    // 进度条样式改变
                    $('#line' + _clicks + ' .progress').addClass('success').removeClass('active');
                    // 上传完成后的回调函数
                    options.done();
                },
                // 显示进度条
                progressall: function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $('#line' + _clicks + ' .progress .bar').css({'width': progress + '%'});
                    $('#line' + _clicks + ' .progress .bar .percents').text(progress + '%');
                }
            });
        });

        // 文件大小转换函数
        var formatFileSize = function (bytes) {
            if (typeof bytes !== 'number') {
                return '';
            }
            if (bytes >= 1000000000) {
                return (bytes / 1000000000).toFixed(2) + ' GB';
            }
            if (bytes >= 1000000) {
                return (bytes / 1000000).toFixed(2) + ' MB';
            }
            return (bytes / 1000).toFixed(2) + ' KB';
        }
    };
}));