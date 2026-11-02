// Tests de la logique de décompte : `npm run test:logic`
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lireIcs, natureDe, nuitsDansAnnee, nuitsUniques, statut, joursDansAnnee } from './nights.ts';

test('une période du 3 au 5 compte 2 nuits', () => {
  assert.deepEqual(nuitsDansAnnee({ debut: '2026-03-03', fin: '2026-03-05' }, 2026), [
    '2026-03-03',
    '2026-03-04',
  ]);
});

test("une période à cheval sur deux années n'est comptée que pour l'année demandée", () => {
  const p = { debut: '2025-12-30', fin: '2026-01-03' };
  assert.equal(nuitsDansAnnee(p, 2025).length, 2);
  assert.equal(nuitsDansAnnee(p, 2026).length, 2);
});

test('une nuit présente dans deux calendriers est comptée une seule fois', () => {
  const airbnb = { debut: '2026-07-01', fin: '2026-07-08' };
  const bookingQuiRecopie = { debut: '2026-07-05', fin: '2026-07-10' };
  assert.equal(nuitsUniques([airbnb, bookingQuiRecopie], 2026).size, 9);
});

test("l'exemple de 70 nuits Airbnb + 60 Booking dépasse 120", () => {
  assert.equal(statut(130, 120), 'depasse');
  assert.equal(statut(120, 120), 'atteint');
  assert.equal(statut(72, 90), 'attention');
  assert.equal(statut(71, 90), 'ok');
});

test('années bissextiles', () => {
  assert.equal(joursDansAnnee(2028), 366);
  assert.equal(joursDansAnnee(2026), 365);
});

test('nature des événements Airbnb et Booking', () => {
  assert.equal(natureDe('Reserved'), 'reservation');
  assert.equal(natureDe('Airbnb (Not available)'), 'blocage');
  assert.equal(natureDe('CLOSED - Not available'), 'inconnu');
});

test('lecture d’un export iCal Airbnb, avec ligne repliée et date sans DTEND', () => {
  const ics = [
    'BEGIN:VCALENDAR',
    'PRODID:-//Airbnb Inc//Hosting Calendar 1.0//EN',
    'BEGIN:VEVENT',
    'DTSTART;VALUE=DATE:20260410',
    'DTEND;VALUE=DATE:20260414',
    'SUMMARY:Reserved',
    'UID:abc@airbnb.com',
    'DESCRIPTION:Reservation URL: https://www.airbnb.com/hosting/reservations/',
    ' details/HMXXXX',
    'END:VEVENT',
    'BEGIN:VEVENT',
    'DTSTART;VALUE=DATE:20260301',
    'SUMMARY:Airbnb (Not available)',
    'UID:def@airbnb.com',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const ev = lireIcs(ics, 'airbnb.ics');
  assert.equal(ev.length, 2);
  assert.deepEqual(
    ev.map((e) => [e.debut, e.fin, e.nature]),
    [
      ['2026-03-01', '2026-03-02', 'blocage'],
      ['2026-04-10', '2026-04-14', 'reservation'],
    ],
  );
});
