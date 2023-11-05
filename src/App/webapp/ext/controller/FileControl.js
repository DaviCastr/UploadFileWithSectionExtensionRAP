sap.ui.define([
    "sap/ui/export/Spreadsheet",
    "sap/ui/core/util/File"
], function (spreadsheet, File) {
    'use strict';

    return {

        onDownloadFile: function (oEvent) {

            try {

                var oLinkFile = oEvent.getSource();

                let oFileName = oLinkFile.getBindingContext().getProperty("FileName");
                let oAttachment = oLinkFile.getBindingContext().getProperty("Attachment");

                let oPosition = oAttachment.indexOf(';base64,');
                let oType = oAttachment.substring(5, oPosition);
                let oB64 = oAttachment.substr(oPosition + 8);
                let oContent = atob(oB64);

                //---create an ArrayBuffer and a view (as unsigned 8-bit)
                let oBuffer = new ArrayBuffer(oContent.length);
                let oViewContent = new Uint8Array(oBuffer);

                //---fill the view, using the decoded base64
                for (var n = 0; n < oContent.length; n++) {
                    oViewContent[n] = oContent.charCodeAt(n);
                }

                //---convert ArrayBuffer to Blob
                let blob = new Blob([oBuffer], { type: oType });

                oPosition = oAttachment.indexOf('.');
                let oFileType = oFileName.substring(10, oPosition);

                oFileName = oFileName.replace(oFileType, "");

                File.save(blob, oFileName, oFileType, oType, null);

            } catch (error) {
                sap.m.MessageToast.show(error.message);
            }

        },

        onReaderFile: function (file) {

            return new Promise((resolve, reject) => {

                var oReader = new FileReader();

                oReader.onload = function (event) {
                    resolve(event.target.result);
                };

                oReader.onerror = (ex) => {
                    reject(ex);
                };

                oReader.readAsDataURL(file);

            });

        },

        handlerError: function (vMessage) {

            sap.m.MessageBox.show(
                vMessage,
                {
                    icon: sap.m.MessageBox.Icon.ERROR,
                    title: "Erro"
                }
            );

        }
    };
    
});