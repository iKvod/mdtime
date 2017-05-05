/**
 * Created by rafa on 25/04/2017.
 */

//Old buttons
// var notifyButtonsInitial = [
//   [{text: 'Опаздываю', callback_data:'not_late'},// late
//     {text: 'Ухожу', callback_data:'not_out'},// go out
//     {text: 'Не приду', callback_data:'not_nc'}],// not come
//   [{text: 'Я в банк', callback_data:'not_tbank'},
//     {text: 'Я из банка', callback_data:'not_fbank'},
//     {text: 'В НК', callback_data:'not_tnk'},
//     {text: 'С НК', callback_data:'not_fnk'}],
//   [{text: 'Я на обед', callback_data:'not_tlunch'},
//     {text: 'С обеда', callback_data:'not_flunch'}]
// ];
var notifyButtonsInitial = [
  [{text: 'Опаздываю', callback_data:'not_late'},// late
    // {text: 'Ухожу', callback_data:'not_out'},// go out
    // {text: 'Не приду', callback_data:'not_nc'}
  ]// not come
];

// callback for Опаздываю
var lateCallButton = [
  [{text: 'На 15 минут', callback_data:'ans_l15min'},// late 15 minutes
    {text: 'На 30 минут', callback_data:'ans_l30min'}// late 30 minutes
    ],// not comt
  [{text: 'На час', callback_data:'ans_l1hour'}, //late 1 hour
    {text: 'На 2 часа', callback_data:'ans_l2hour'}] // late 2 hours
];


//callback for Ухожу
var outCallButton = [
  [{text: 'На час раньше', callback_data: 'ans_o1hour'},// late 15 minutes
    {text: 'На 2 часа раньше', callback_data: 'ans_o2hour'}// late 30 minutes
  ],// not comt
  [{text: 'На 3 часа реньше', callback_data: 'ans_o3hour'}, //late 1 hour
    {text: 'На 4 часа раньше', callback_data:'ans_o4hour'}] // late 2 hours
];


module.exports = {
  notifyButtonsInitial: notifyButtonsInitial,
  lateCallButton: lateCallButton,
  outCallButton: outCallButton
};