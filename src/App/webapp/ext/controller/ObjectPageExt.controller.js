sap.ui.define([
    "dflc/apps/uploadfilesext/ext/controller/FileControl"
], function(FileControl) {
    'use strict';

    var oI18n;
    var oThatContext;

    return {

        onAfterRendering: function (oEvent) {

            oI18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            oThatContext = this;

            try {

                let oFileUploader = this.byId("FileUploadDetails");
                let oBtnDeleteFile = this.byId("BtnDeleteFile");
                let oLinkFile = this.byId("LKFileName");

                oFileUploader.attachChange(this.onChangeFile);
                oFileUploader.attachFilenameLengthExceed(this.onFileNameExceeded);
                oBtnDeleteFile.attachPress(this.onRemoveFile);
                oLinkFile.attachPress(FileControl.onDownloadFile);

            } catch (error) {

            }

        },

        onChangeFile: function (oEvent) {

            var oFileUploader = oEvent.oSource;
            var oEvt = oEvent;

            oFileUploader.checkFileReadable().then(

                async function (sucesso) {

                    var oFile = oFileUploader.FUEl.files[0];

                    if (oFileUploader.getValue() === '') {
                        sap.m.MessageToast.show(oI18n.getText("inforSelectFile"));
                        return;
                    }

                    var securedExecution = async () => {

                        await FileControl.onReaderFile(oFile).then(

                            async attachment => {

                                let oContext = oFileUploader.getBindingContext();
                                let oPath = oContext.getPath();
                                let oFileName = oPath.concat("/FileName");
                                let oMimeType = oPath.concat("/MimeType");
                                let oAttachment = oPath.concat("/Attachment");

                                await oContext.getModel().setProperty(oFileName, oFile.name, oContext, true);

                                await oContext.getModel().setProperty(oMimeType, oFile.type, oContext, true);

                                await oContext.getModel().setProperty(oAttachment, attachment.toString(), oContext, true);

                                oFileUploader.clear();

                            },

                            error => {

                                let oMessageManager = sap.ui.getCore().getMessageManager();
                                let oMessage = new sap.ui.core.message.Message({
                                    message: oI18n.getText("errorGetReader") + " " + item.getFileName(),
                                    persistent: true,
                                    type: sap.ui.core.MessageType.Error
                                });

                                oMessageManager.addMessages(oMessage);

                            });

                    }

                    let oParameters = {
                        busy: {
                            set: true,
                            check: true
                        },
                        dataloss: {
                            popup: true,
                            navigation: false
                        }
                    }

                    oThatContext.extensionAPI.securedExecution(securedExecution, oParameters).then(

                        (Sucesso) => {
                            let oControlerDraft = oThatContext.extensionAPI.getTransactionController();
                            oControlerDraft.saveDraft();
                            sap.m.MessageToast.show(oI18n.getText("successAddFile"));
                        },

                        (error) => {

                            sap.m.MessageToast.show(oI18n.getText("errorUpdateFile"));
                            oFileUploader.getModel().resetChanges([oFileUploader.getBindingContext().getPath()], true, true);

                        }

                    );

                }.bind(this),

                function (error) {

                    FileControl.handlerError(oI18n.getText("errorReaderFile"))

                }).then(function (error) {

                    oFileUploader.clear();

                }.bind(this));

        },

        onRemoveFile: function (oEvent) {

            var oFileUploader = oThatContext.byId("FileUploadDetails");
            var oBtnDelete = oEvent.oSource;

            var securedExecution = async () => {
                
                let oContext = oFileUploader.getBindingContext();
                let oPath = oContext.getPath();
                let oFileName = oPath.concat("/FileName");
                let oMimeType = oPath.concat("/MimeType");
                let oAttachment = oPath.concat("/Attachment");

                await oBtnDelete.getModel().setProperty(oFileName, "", oContext, true);
                await oBtnDelete.getModel().setProperty(oMimeType, "", oContext, true);
                await oBtnDelete.getModel().setProperty(oAttachment, "", oContext, true);

                oFileUploader.clear();

            }

            let oParameters = {
                busy: {
                    set: true,
                    check: true
                },
                dataloss: {
                    popup: true,
                    navigation: false
                }
            }

            oThatContext.extensionAPI.securedExecution(securedExecution, oParameters).then(

                (Sucesso) => {
                    let oControlerDraft = oThatContext.extensionAPI.getTransactionController();
                    oControlerDraft.saveDraft();
                    sap.m.MessageToast.show(oI18n.getText("successRemoveFile"));
                },

                (error) => {

                    sap.m.MessageToast.show(oI18n.getText("errorDeleteFile"));
                    oFileUploader.getModel().resetChanges([oFileUploader.getBindingContext().getPath()], true, true);

                }

            );

        },

        onFileNameExceeded: function (oEvent) {

            FileControl.handlerError(oI18n.getText("inforFileNameBig"))

        },

    };
});