$(function() {
    var url = window.location.href,
        indexReg = /index/,
        registerReg = /register/,
        searchReg = /search/,
        detailReg = /detail/,
        limit = 10,
        offset = 0;
    var voteFn = {
            setStorage: function(key, obj) {
                localStorage.setItem(key, JSON.stringify(obj));
            },

            getStorage: function(key) {
                return JSON.parse(localStorage.getItem(key));
            },

            delteStorage: function(key) {
                localStorage.removeItem(key);
            },
            /*首页用户加载*/
            useInfo: function(objs) {
                var str = '';
                for (var i = 0; i < objs.length; i++) {
                    str += '<li>' + '<div class="head">' + '<a href="/vote/detail/' + objs[i].id + '">' + '<img src="' + objs[i].head_icon + '" alt="">' + '</a>' + '</div>' + '<div class="up">' + '<div class="vote">' + '<span>' + objs[i].vote + '票</span>' + '</div>' + '<div class="btn" id=' + objs[i].id + '>' + '投TA一票' + '</div>' + '</div>' + '<div class="descr">' + '<a href="/vote/detail/' + objs[i].id + '">' + '<div>' + '<span>' + objs[i].username + '</span>' + '<span>|</span>' + '<span>编号#' + objs[i].id + '</span>' + '</div>' + '<p>' + objs[i].description + '</p>' + '</a>' + '</div>' + '</li>';
                }
                return str;
            },
            getRegisterData: function() {
                var username = $('.username').val();
                var mobile = $('.mobile').val();
                var description = $('.description').val();
                var password = $('.password').val();
                var gender = $('.gender input:checked').attr('value');

                if (!username) {
                    alert("请填写用户名称");
                    return false;
                }
                if (!/^\d{11}$/.test(mobile)) {
                    alert("请填写正确格式的手机号码");
                    return false;
                }
                if (!description) {
                    alert("请填写自我描述内容");
                    return false;
                }
                return {
                    username: username,
                    mobile: mobile,
                    description: description,
                    password: password,
                    gender: gender
                }
            },

        }
        /*index页面用户信息的加载*/
    if (indexReg.test(url)) {
        $.ajax({
            url: '/vote/index/data?limit=10&offset=0',
            type: 'get',
            success: function(result) {
                var result = JSON.parse(result);
                var str = voteFn.useInfo(result.data.objects);
                $('.coming').html(str);
            }
        })
    } else if (registerReg.test(url)) {
        /*注册用户时提交的请求*/
        $('.rebtn').click(function() {
        	  var registerData = voteFn.getRegisterData();
            $.ajax({
                url: '/vote/register/data',
                type: 'POST',
                data: registerData,
                success: function(data) {
                    data = JSON.parse(data);
                    if (data.errno == 0) {
                        var id = data.id;
                        var reg = /(.*)register/;
                        var voteUser = {
                            username: registerData.username,
                            password: registerData.password,
                            id: id
                        }
                        voteFn.setStorage('voteUser', voteUser);
                        alert(data.msg);
                        window.location = reg.exec(url)[1] + 'index';
                    } 
                }
            })
        })

    }

})
