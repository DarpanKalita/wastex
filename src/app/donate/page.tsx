"use client";

import { useState } from 'react'

function getRandomTxnId() {
  return 'TXN' + Math.floor(10000000 + Math.random() * 90000000);
}

const PAYMENT_METHODS = [
  { key: 'card', label: 'Card' },
  { key: 'upi', label: 'UPI' },
  { key: 'qr', label: 'QR Code' },
  { key: 'apps', label: 'Payment Apps' },
];

export default function DonatePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [txnId, setTxnId] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [phone, setPhone] = useState('')
  const [emailStatus, setEmailStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [upiId, setUpiId] = useState('');

  // Card preview helpers
  // Only last 4 digits visible, rest as •
  const cleanCard = cardNumber.replace(/\D/g, '').slice(0, 16);
  const maskedCard = cleanCard
    ? '•••• •••• •••• ' + cleanCard.slice(-4).padStart(4, '•')
    : '•••• •••• •••• ••••';
  const previewName = cardName ? cardName.toUpperCase() : 'YOUR NAME';
  const previewExpiry = cardExpiry ? cardExpiry : '••/••';

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault()
    setShowModal(true)
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    setTimeout(async () => {
      const txn = getRandomTxnId()
      setTxnId(txn)
      setProcessing(false)
      setSuccess(true)
      // Send email receipt
      try {
        setEmailStatus('')
        const res = await fetch('/api/send-receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            name,
            amount,
            txnId: txn,
            date: new Date().toLocaleString(),
          }),
        })
        if (res.ok) {
          setEmailStatus('Receipt sent to your email!')
        } else {
          setEmailStatus('Payment successful, but failed to send email receipt.')
        }
      } catch {
        setEmailStatus('Payment successful, but failed to send email receipt.')
      }
    }, 2200)
  }

  const resetAll = () => {
    setShowModal(false)
    setProcessing(false)
    setSuccess(false)
    setTxnId('')
    setCardNumber('')
    setCardName('')
    setCardExpiry('')
    setCardCvv('')
    setPhone('')
    setPaymentMethod('card')
    setUpiId('')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 py-0 px-0">
      {/* Removed background image/overlay to ensure gray background is visible */}
      {/* Hero Banner */}
      <div className="w-full flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-r from-primary-light/80 via-primary/80 to-primary-dark/80 relative z-10 animate-fade-in">
        {/* Floating eco SVG */}
        <svg className="absolute left-8 top-4 w-24 h-24 opacity-20 animate-float hidden md:block" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 10C140 10 190 60 190 100C190 140 140 190 100 190C60 190 10 140 10 100C10 60 60 10 100 10Z" fill="#9DC08B"/>
          <path d="M100 40C120 40 160 80 160 100C160 120 120 160 100 160C80 160 40 120 40 100C40 80 80 40 100 40Z" fill="#609966"/>
        </svg>
        <h1 className="text-4xl font-extrabold text-primary-dark dark:text-background mb-2">Support WasteX</h1>
        <p className="text-lg text-primary-dark dark:text-primary-light max-w-2xl text-center mb-4" style={{textShadow:'0 2px 8px rgba(64,81,59,0.10)'}}>Your donation helps us keep cities cleaner and greener. Every contribution makes a difference in building a sustainable future with WasteX.</p>
      </div>
      {/* Donation Form Card */}
      <div className="relative z-10 rounded-2xl shadow-2xl p-6 w-full max-w-md border-2 border-transparent animate-fade-in -mt-12 mb-8 bg-white/80 dark:bg-white/30 backdrop-blur-2xl"
        style={{
          borderImage: 'linear-gradient(90deg, #9DC08B 0%, #609966 60%, #40513B 100%) 1',
          boxShadow: '0 8px 40px 0 rgba(64,81,59,0.18)',
          backdropFilter: 'blur(24px)',
        }}>
        <form onSubmit={handleDonate} className="space-y-6 px-2 pb-2">
          <div>
            <label className="block text-sm font-medium text-primary-dark mb-1">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 border border-primary/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 placeholder:text-gray-500 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-dark mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-primary/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 placeholder:text-gray-500 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-dark mb-1">Amount (INR)</label>
            <input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full px-4 py-3 border border-primary/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 placeholder:text-gray-500 shadow-sm" />
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl shadow-lg border border-primary focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all duration-200 text-lg tracking-wide" style={{textShadow:'0 2px 8px rgba(0,0,0,0.18)'}}>Donate</button>
        </form>
      </div>
      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div className="relative w-full max-w-md payment-container rounded-2xl shadow-2xl overflow-y-auto max-h-[95vh] flex flex-col border border-primary/30 bg-white animate-fade-in">
              {/* Green gradient header bar */}
              <div className="w-full rounded-t-2xl bg-gradient-to-r from-primary-light via-primary to-primary-dark py-4 px-6 flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white tracking-wide">Complete Your Donation</h2>
                <button className="text-white text-2xl font-bold focus:outline-none" onClick={resetAll}>&times;</button>
              </div>
              {/* Floating eco SVG in modal */}
              <svg className="absolute left-[-40px] top-[-40px] w-32 h-32 opacity-10 animate-float pointer-events-none" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 10C140 10 190 60 190 100C190 140 140 190 100 190C60 190 10 140 10 100C10 60 60 10 100 10Z" fill="#9DC08B"/>
                <path d="M100 40C120 40 160 80 160 100C160 120 120 160 100 160C80 160 40 120 40 100C40 80 80 40 100 40Z" fill="#609966"/>
              </svg>
              {/* Payment Method Tabs */}
              <div className="flex justify-center gap-2 mt-4 mb-6">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.key}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors focus:outline-none shadow-md ${paymentMethod === m.key ? 'bg-primary text-white border-primary scale-105' : 'bg-white text-primary border-primary/20 hover:bg-primary/10'}`}
                    onClick={() => setPaymentMethod(m.key)}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              {/* Payment Form */}
              {!processing && !success && (
                <form onSubmit={handlePay} className="p-4 sm:p-6 overflow-y-auto flex-1">
                  {/* Card Payment */}
                  {paymentMethod === 'card' && (
                    <>
                      {/* Card Preview */}
                      <div className="payment-card p-5 mb-6 relative h-44 bg-gradient-to-br from-gray-900 via-gray-500 to-gray-200 text-white rounded-3xl shadow-2xl border-2 border-gray-300/60">
                        <div className="flex justify-between items-start">
                          <div className="chip bg-gradient-to-br from-gray-200 via-gray-400 to-gray-100 w-10 h-7 rounded-md shadow-sm border border-gray-300"></div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold tracking-widest text-gray-200 opacity-90">AMEX</span>
                            <svg width="36" height="16" viewBox="0 0 36 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="36" height="16" rx="3" fill="url(#silver)"/>
                              <text x="7" y="12" fill="#222" fontSize="10" fontWeight="bold">AMEX</text>
                              <defs>
                                <linearGradient id="silver" x1="0" y1="0" x2="36" y2="16" gradientUnits="userSpaceOnUse">
                                  <stop stopColor="#e0e0e0" />
                                  <stop offset="0.5" stopColor="#b0b0b0" />
                                  <stop offset="1" stopColor="#f8f8f8" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>
                        </div>
                        <div className="mt-6 text-xl tracking-wider font-mono font-medium select-none drop-shadow" style={{letterSpacing:'0.15em'}}>{maskedCard}</div>
                        <div className="flex justify-between items-center mt-8">
                          <div>
                            <div className="text-xs opacity-80">CARD HOLDER</div>
                            <div className="text-sm font-medium uppercase">{previewName}</div>
                          </div>
                          <div>
                            <div className="text-xs opacity-80">EXPIRES</div>
                            <div className="text-sm font-medium">{previewExpiry}</div>
                          </div>
                        </div>
                      </div>
                      {/* Amount summary and progress */}
                      <div className="mb-6">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 font-medium">Amount to pay</span>
                          <span className="text-gray-800 font-semibold text-lg">₹{amount}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div className="payment-progress h-2 rounded-full bg-gradient-to-r from-blue-500 via-primary-400 to-primary-500 animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      {/* Card details */}
                      <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber
                            .replace(/\D/g, '')
                            .slice(0, 16)
                            .replace(/(.{4})/g, '$1 ')
                            .trim()
                          }
                          onChange={e => {
                            let val = e.target.value.replace(/\D/g, '').slice(0, 16);
                            setCardNumber(val);
                          }}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 input-highlight focus:outline-none"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          required
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Name on Card</label>
                        <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 input-highlight focus:outline-none" placeholder="John Doe" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Expiry Date</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={e => {
                              let val = e.target.value.replace(/[^0-9]/g, '');
                              if (val.length > 4) val = val.slice(0, 4);
                              if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
                              setCardExpiry(val);
                            }}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 input-highlight focus:outline-none"
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">CVV</label>
                          <input
                            type="text"
                            value={cardCvv}
                            onChange={e => setCardCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 input-highlight focus:outline-none"
                            placeholder="•••"
                            maxLength={3}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {/* UPI Payment */}
                  {paymentMethod === 'upi' && (
                    <>
                      <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Enter your UPI ID</label>
                        <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 input-highlight focus:outline-none" placeholder="yourname@upi" required />
                      </div>
                      <div className="mb-6">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 font-medium">Amount to pay</span>
                          <span className="text-gray-800 font-semibold text-lg">₹{amount}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div className="payment-progress h-2 rounded-full bg-gradient-to-r from-blue-500 via-primary-400 to-primary-500 animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                    </>
                  )}
                  {/* QR Code Payment */}
                  {paymentMethod === 'qr' && (
                    <>
                      <div className="flex flex-col items-center mb-6">
                        <img src="/images/demo-qr.png" alt="Scan QR to pay" className="w-40 h-40 rounded-lg border-4 border-primary-200 mb-4" />
                        <div className="text-gray-700 dark:text-gray-300 text-center mb-2">Scan this QR code with any UPI app to pay</div>
                        <div className="text-gray-800 font-semibold">Amount: ₹{amount}</div>
                      </div>
                    </>
                  )}
                  {/* Payment Apps */}
                  {paymentMethod === 'apps' && (
                    <>
                      <div className="flex flex-col items-center mb-6">
                        <div className="flex gap-6 mb-4">
                          <img src="/images/paytm.png" alt="Paytm" className="w-12 h-12 rounded-full shadow" />
                          <img src="/images/phonepe.png" alt="PhonePe" className="w-12 h-12 rounded-full shadow" />
                          <img src="/images/gpay.png" alt="Google Pay" className="w-12 h-12 rounded-full shadow" />
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 text-center mb-2">Open your favorite payment app and use the QR or UPI ID to pay</div>
                        <div className="text-gray-800 font-semibold">Amount: ₹{amount}</div>
                      </div>
                    </>
                  )}
                  {/* Common fields for all methods */}
                  {(paymentMethod === 'card' || paymentMethod === 'upi') && (
                    <>
                      <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Email for receipt</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 input-highlight focus:outline-none" placeholder="your@email.com" required />
                      </div>
                      <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Phone for SMS confirmation</label>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 input-highlight focus:outline-none" placeholder="+91 98765 43210" required />
                      </div>
                    </>
                  )}
                  {(paymentMethod === 'card' || paymentMethod === 'upi') && (
                    <button type="submit" className="w-full payment-btn text-white font-bold py-3 px-4 rounded-xl shadow-lg backdrop-blur-md border border-primary/30 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 bg-gradient-to-r from-blue-500 to-primary-600 hover:from-blue-600 hover:to-primary-700">
                      <i className="fas fa-lock mr-2"></i>
                      Pay ₹{amount}
                    </button>
                  )}
                  {(paymentMethod === 'qr' || paymentMethod === 'apps') && (
                    <button type="button" onClick={handlePay} className="w-full payment-btn text-white font-bold py-3 px-4 rounded-xl shadow-lg backdrop-blur-md border border-primary/30 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 bg-gradient-to-r from-blue-500 to-primary-600 hover:from-blue-600 hover:to-primary-700 mt-2">
                      <i className="fas fa-lock mr-2"></i>
                      I have paid
                    </button>
                  )}
                  <div className="mt-4 text-center text-sm text-gray-500">
                    <div className="flex items-center justify-center">
                      <i className="fas fa-shield-alt text-primary-500 mr-2"></i>
                      <span>256-bit SSL secured payment</span>
                    </div>
                  </div>
                </form>
              )}
              {/* Processing State */}
              {processing && !success && (
                <div className="p-4 sm:p-6 flex flex-col items-center justify-center h-96 animate-fade-in overflow-y-auto flex-1">
                  <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 bg-blue-100 rounded-full opacity-75 animate-ping"></div>
                    <div className="relative w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full flex items-center justify-center">
                      <i className="fas fa-lock text-blue-500 text-xl"></i>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Processing Payment</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center max-w-xs">We're securely processing your payment. This may take a few moments.</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-4">
                    <div className="payment-progress h-1.5 rounded-full bg-gradient-to-r from-blue-500 via-primary-400 to-primary-500 animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              )}
              {/* Success State */}
              {success && (
                <div className="p-4 sm:p-6 flex flex-col items-center justify-center h-96 animate-fade-in overflow-y-auto flex-1 bg-white rounded-2xl shadow-xl border border-primary/10">
                  {/* Green confetti/checkmark SVG */}
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 payment-success bg-gradient-to-br from-green-300 via-green-400 to-green-500 shadow-lg relative">
                    <svg className="w-16 h-16 text-green-700" fill="none" viewBox="0 0 48 48" stroke="currentColor">
                      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="4" fill="#fff" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M16 24l7 7 9-13" stroke="#22c55e" />
                    </svg>
                    {/* Confetti */}
                    <svg className="absolute -top-4 -left-4 w-10 h-10 opacity-70" viewBox="0 0 32 32"><circle cx="6" cy="6" r="2" fill="#22c55e"/><circle cx="26" cy="10" r="1.5" fill="#9DC08B"/><circle cx="20" cy="26" r="1.5" fill="#609966"/><circle cx="10" cy="24" r="1.2" fill="#40513B"/></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-primary-dark dark:text-primary mb-2 drop-shadow">Payment Successful!</h3>
                  <p className="text-primary-dark dark:text-primary-light text-center mb-6">Your payment of ₹{amount} has been processed.</p>
                  <div className="w-full bg-gradient-to-r from-green-100 via-green-50 to-green-200 border border-green-200 p-4 rounded-lg mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-primary-dark">Transaction ID:</span>
                      <span className="font-mono text-primary-dark">{txnId}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-primary-dark">Date:</span>
                      <span className="text-primary-dark">{new Date().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-primary-dark">Status:</span>
                      <span className="text-green-700 font-medium">Completed</span>
                    </div>
                  </div>
                  <div className="w-full mt-2">
                    <div className="flex items-center text-sm text-primary-dark mb-2">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" /></svg>
                      <span>Email receipt sent to <span className="font-medium">{email}</span></span>
                    </div>
                    <div className="flex items-center text-sm text-primary-dark">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" /></svg>
                      <span>SMS confirmation sent to <span className="font-medium">{phone}</span></span>
                    </div>
                  </div>
                  {emailStatus && (
                    <div className="mt-4 text-green-700 dark:text-green-300 text-sm text-center">{emailStatus}</div>
                  )}
                  <button onClick={resetAll} className="mt-6 w-full payment-btn text-white font-bold py-2 px-4 rounded-xl shadow-lg backdrop-blur-md border border-primary/30 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 bg-gradient-to-r from-green-400 to-primary-600 hover:from-green-500 hover:to-primary-700">
                    Make Another Payment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Your Impact Section */}
      <div className="w-full max-w-2xl mx-auto mb-8 px-4">
        <div className="bg-primary-light/70 dark:bg-primary-dark/70 rounded-xl shadow p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-3xl font-bold text-primary-dark dark:text-primary-light mb-1">🌱</span>
            <span className="text-lg font-semibold text-primary-dark dark:text-primary-light">Your Impact</span>
            <span className="text-primary-light dark:text-primary-dark text-sm mt-1">Every ₹100 helps recycle 10kg of waste</span>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <span className="text-2xl font-bold text-primary-dark dark:text-primary-light">1000+</span>
            <span className="text-primary-light dark:text-primary-dark text-sm">Communities Served</span>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <span className="text-2xl font-bold text-primary-dark dark:text-primary-light">5000+</span>
            <span className="text-primary-light dark:text-primary-dark text-sm">Tons of Waste Managed</span>
          </div>
        </div>
      </div>
      {/* FontAwesome CDN for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  )
} 