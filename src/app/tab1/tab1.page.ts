/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/ban-types */
// import { Component, Input } from '@angular/core';

import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public nome: String;
  public email: String;
  public telefone: Number;
  public data: String;
  public sexo: String;

  cadastrar(){
    const arrRowsTable = JSON.parse(localStorage.getItem('arrRowsTable'));
    let tamanhoStorage = 1;

    if(this.nome == undefined || this.email == undefined || this.telefone == undefined || this.data == undefined || this.sexo == undefined){
      this.CadastroErrado();
      return;
    }

    // ----

    const result = this.dataAtual();
    if(this.data > result){
      this.dataInseridaMaior();
      return;
    }

    // ----

    const valida_Email = this.validaEmail(this.email);
    if(valida_Email == false){
      this.emailInvalido();
      return;
    }

    // ----

    const valida_Telefone = this.validaTelefone(this.telefone);
    if(valida_Telefone == false){
      this.telefoneInvalido();
      return;
    }

    // ----

    const validaDados = this.armazenaLocal();
    if(validaDados == false){
      return;
    }

    // ----

    if(!(arrRowsTable === null)){
      tamanhoStorage = arrRowsTable.length + 1;
    }

    // ----

    this.data = new Date().toLocaleDateString('pt-br', {timeZone: 'UTC'});

    // ----

    this.CadastroSucesso();
  }

  // ---- armazena os dados em LocalStorage ---- //
  armazenaLocal(){
    const rowTable = {
      nome: String(this.nome),
      email: String(this.email),
      telefone: Number(this.telefone),
      data: String(this.data),
      sexo: String(this.sexo)
    };
    const arrRowsTable = JSON.parse(localStorage.getItem('arrRowsTable') || '[]');

    for(let i = 0 ; i < arrRowsTable.length; i++){
      if(arrRowsTable[i].nome === this.nome){
        this.NomeInvalido();
        return false;
      }

      if(arrRowsTable[i].email === this.email){
        this.EmailInvalido();
        return false;
      }
    }

    arrRowsTable.push(rowTable);
    localStorage.setItem('arrRowsTable', JSON.stringify(arrRowsTable));
  }

  // ---- valida dados repetidos ---- //
  validaDados(arr){
    for(let i = 0 ; i < arr.length; i++){
      if(arr[i].nome === this.nome){
        this.NomeInvalido();
        return;
      }

      if(arr[i].email === this.email){
        this.EmailInvalido();
        return;
      }
    }
  }

  // ---- limpa o formulario quando o usuario solicita ---- //
  limpaFormulario(){
    if(this.nome == undefined && this.email == undefined && this.telefone == undefined && this.data == undefined && this.sexo == undefined){
      this.fomularioLimpo();
    }
    else{
      this.limpouFormulario();
      this.nome = null;
      this.email = null;
      this.telefone = null;
      this.data = null;
      this.sexo = null;
    }
  }

  // ---- limpa após o cadastro ---- //
  limpaAposCadastro(){
    this.nome = null;
    this.email = null;
    this.telefone = null;
    this.data = null;
    this.sexo = null;
  }

  // ---- pega data atual ---- //
  dataAtual(){
    const data = new Date();
    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();
    // var day = "";
    let month = '';
    if (mes < 10){
      month = '0' + String(mes);
    }
    const result = ano +'-'+ month +'-'+ dia;
    return result;
  }

  //

  formatPattern(inputStr, pattern, example) {
    const strRegExp = String(pattern).replace(/^\/(^)?/, '').replace(/($)?\/$/, '');
    const arrStrRegFixed = strRegExp.replace(/\\/g, '').split(/\([^()]+\)/g);
    const arrCharRegFixed = arrStrRegFixed.reduce((acc, e)=> acc = [...acc, ...e], []);

    const format = arrStrRegFixed.reduce((acc, e, i) => acc+e+'$'+(i+1), '').replace(/\$\d+$/, '');

    const arrStrRegDynamic = strRegExp.match(/\([^()]+\)/g);
    const regExpDynamic = RegExp(arrStrRegDynamic.join(''));
    const inputStrDynamic = arrCharRegFixed.reduce((acc, e) => acc.replace(e, ''), inputStr);
    const exampleDynamic = arrCharRegFixed.reduce((acc, e) => acc.replace(e, ''), example);

    const exToComplete = exampleDynamic.slice(inputStrDynamic.length);
    const inputStrCompleted = inputStrDynamic + exToComplete;
    const inputStrCompletedFormated = inputStrCompleted.replace(regExpDynamic, format);
    const inputStrFormated = [...exToComplete].reverse().reduce((acc, e)=>
        acc.slice(0, acc.lastIndexOf(e)), inputStrCompletedFormated);

    return inputStrFormated;
  }

  // ---- valida dados de acordo com padrão ---- //
  validaEmail(email){
    const condicoes = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    return condicoes.test(email);
  }

  validaTelefone(telefone){
    const condicoes = /^\({0,1}[1-9]{2}\){0,1} {0,1}9 {0,1}[0-9]{4}-{0,1}[0-9]{4}$/;
    return condicoes.test(telefone);
  }


  constructor(public alertController: AlertController) {
    setTimeout(()=> {
      const telefoneEl = document.querySelector('#telefone');

      const formatTel = (ev) => {
        const inputFormat = this.formatPattern(ev.target.value, /\((\d{2})\) 9 (\d{4})-(\d{4})/, '(33) 9 1111-2222');
        setTimeout(()=> ev.target.value = inputFormat, 0);
      };
      telefoneEl.addEventListener('input', formatTel);
    }, 0);
  }

  // ---- área de alertas ---- //
  async CadastroSucesso() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cadastro Realizado!',
      subHeader: 'O cadastro foi realizado com sucesso!',
      buttons: ['OK']
    });
    await alert.present();
    this.limpaAposCadastro();
  }

  async CadastroErrado() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cadastro não foi realizado!',
      subHeader: 'Por favor, verifique todos os campos e tente novamente',
      buttons: ['OK']
    });
    await alert.present();
  }

  async dataInseridaMaior(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'A data inserida está incorreta!',
      subHeader: 'Por favor, verifique o campo data e tente novamente, pois é maior que a data atual!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async emailInvalido(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'O e-mail informado é invalido!',
      subHeader: 'Por favor, verifique o campo email e tente novamente.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async telefoneInvalido(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'O telefone informado é invalido!',
      subHeader: 'Por favor, verifique o campo telefone e tente novamente.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async fomularioLimpo(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'O formulário já está limpo!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async limpouFormulario(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'O formulário está limpo!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async NomeInvalido() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'O nome inserido é inválido!',
      subHeader: 'Por favor, verifique o campo nome e tente novamente, pois este nome já consta em nosso cadastrado!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async EmailInvalido(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'O email inserido é inválido!',
      subHeader: 'Por favor, verifique o campo email e tente novamente, pois este email já consta em nosso cadastrado!',
      buttons: ['OK']
    });
    await alert.present();
  }
}
