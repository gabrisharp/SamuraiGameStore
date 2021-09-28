
const Login = require('../models/LoginModel');

exports.index = (req, res) =>{
    if(req.session.user) req.session.destroy();
    res.render('login');
}

exports.create = async (req, res) =>{
    // Validação de Acesso
    const acesso = req.body.cargo === 'Gerente' ? 0 : 1;
    req.body.acesso = acesso;

    const user = new Login(req.body);
    try{
        await user.create();
    }catch(e){
        console.log('Erro ao tentar criar o usuário', e)
    }
    

    if(user.erros.length > 0){
        return console.log('Erros de validação para Criação do Usuario: ', user.erros)
    }
    return res.send('usuario criado com sucesso');
}


exports.alter = async (req, res) =>{
    const login = new Login(req.body);
    login.user = req.session.user;

    await login.alter();

    if(login.erros.length > 0){
        req.flash('erros', login.erros);
        req.session.save( function(){
            console.log(login.erros)
            return res.redirect('back');
        });
        return;
    }
    req.flash('success', 'Usuario alterado com sucesso');
    req.session.user = Object.assign({}, login.user);
    req.session.save( function(){
        return res.redirect('back');
    }); 
}


exports.login = async (req, res) =>{
    const login = new Login(req.body);
    await login.login();
    await login.cargos()
    //Buscar os cargos disponíveis             


    if(login.erros.length > 0){
        req.flash('erros', login.erros);
        req.session.save( function(){
            console.log(login.erros)
            return res.redirect('../login');
        });
        return;
    }
    req.flash('success', 'Você está logado');
    req.session.user = Object.assign({}, login.user);
    req.session.save( function(){
        return res.redirect('/');
    });         
}