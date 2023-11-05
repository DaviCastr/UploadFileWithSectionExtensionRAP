@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'CDS de interface'
define root view entity YI_RAP_INVOICE_EXT_DFLC
  as select from ytbrap_iext_dflc
{
  key uuid               as Guid,
      invoice            as Invoice,
      comments           as Comments,
      attachment         as Attachment,
      mimetype           as MimeType,
      filename           as FileName,
      @Semantics.user.createdBy: true
      createdby          as CreatedBy,
      @Semantics.systemDateTime.createdAt: true
      createdat          as CreatedAt,
      @Semantics.user.lastChangedBy: true
      lastchangedby      as LastChangedBy,
      //total ETag field
      @Semantics.systemDateTime.lastChangedAt: true
      lastchangeddat     as LastChangedAt,
      //local ETag field --> OData ETag
      @Semantics.systemDateTime.localInstanceLastChangedAt: true
      locallastchangedat as LocalLastChangedAt

}
