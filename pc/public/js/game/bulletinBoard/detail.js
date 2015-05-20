 //var empty = function () {
 //};
 var id = function (eltId) {
 return document.getElementById(eltId);
 };
 var form = id('form');
 form.addEventListener('click', function (e) {
//	 alert(JSON.stringify(CocoonJs));
//	 alert(CocoonJs.WebDialog);
//	 alert(JSON.stringify(CocoonJs.WebDialog));
//
//(CocoonJS.WebDialog.close) ? CocoonJS.WebDialog.close() : Cocoon.Widget.WebDialog.close(); 
//alert(JSON.stringify(window));
//alert(JSON.stringify(window.parent));
Cocoon.App.forwardAsync("window.settingCloseWebview()", function(){
//alert("callback");
});
//	 if(Cocoon.Widget.WebDialog.close){
//		 Cocoon.Widget.WebDialog.close();
//	 }
//	 else{
//		 window.parent.CocoonJSCloseWebDialog();
//	 }
	 //window.parent.CocoonJSCloseWebDialog();
	 //Cocoon.Widget.WebDialog.close();
	 //        switch(e.target.id) {
	 //            case 'close':
	 //                Cocoon.App.forwardAsync("window.loginCallback('close')", empty);
	 //                break;
	 //case 'toRegister':
	 //    Cocoon.App.forwardAsync("window.loginCallback('toRegister')", empty);
	 //    break;
	 //case 'login':
	 //    var params = {
	 //        account: id('account').value,
	 //        password: id('password').value
	 //    };
	 //
	 //    if(params.account.length <= 5) {
	 //        showTips('帐号只能是6~16位');
	 //        return;
	 //    }
	 //
	 //    if(!params.password) {
	 //        showTips('密码不能为空');
	 //        return;
	 //    }
	 //
	 //    Cocoon.App.forwardAsync("window.loginCallback('login', " + JSON.stringify(params) + ")", empty);
	 //    break;
	 //}
 });
 //
 //function showTips(tips) {
 //    id('tipsText').innerText = tips;
 //    id('tipsText').style.display = 'block';
 //}
 //
 //window.showTips = showTips;

