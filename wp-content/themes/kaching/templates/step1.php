<div class="panel panel-default">
    <div class="panel-heading">Campaign information</div>
    <div class="panel-body">
        <form id="addCampaignStep1" data-parsley-validate>
            <div class="form-group">
                <input id="client" type="text" required="" class="form-control typeahead name" placeholder="Customer">
                <span class="indicator icon icon-down"></span>
            </div>
            <div class="form-group">
                <input name="name"  type="text" required=""  class="form-control campaign-name" placeholder="Campaign name">
            </div>
            <div class="form-group">
                <input id="datarange" type="text" required="" class="form-control" placeholder="Date range">
                <span class="indicator icon icon-down"></span>
            </div>
            <div class="form-group">
                <input name="budget" id="budget1" type="text" required="" data-parsley-type="number" data-parsley-min="0.01" class="form-control budget" placeholder="Budget">
            </div>
        </form>
    </div>
</div>
<div class="steps-footer">
    <div class="pull-right">
        <a id="submit-first" value="validate" class="btn btn-primary">Next step</a>
    </div>
</div>