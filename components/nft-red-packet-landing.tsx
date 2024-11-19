'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wallet, Share2, Gift, Sparkles, Code2, Coins, History, User } from 'lucide-react'

export function NftRedPacketLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTouching, setIsTouching] = useState(false)
  const [rotationVelocity, setRotationVelocity] = useState(0)
  const lastTouchX = useRef(0)
  const lastTimeStamp = useRef(0)
  const animationFrameId = useRef<number>()
  const rotationY = useMotionValue(0)

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [15, -15])
  const rotateY = useTransform(x, [-100, 100], [-15, 15])
  const springConfig = { 
    damping: 15,
    stiffness: 500,
    mass: 0.8
  }
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)

  // 处理旋转和自动归位
  useEffect(() => {
    const animate = () => {
      const currentRotation = rotationY.get()
      if (Math.abs(rotationVelocity) > 0.1) {
        rotationY.set(currentRotation + rotationVelocity)
        setRotationVelocity(rotationVelocity * 0.95) // 摩擦力
        animationFrameId.current = requestAnimationFrame(animate)
      } else if (!isTouching) {
        const targetRotation = Math.round(currentRotation / 360) * 360
        const diff = targetRotation - currentRotation
        if (Math.abs(diff) > 0.5) {
          rotationY.set(currentRotation + diff * 0.1) // 弹性系数
          animationFrameId.current = requestAnimationFrame(animate)
        }
      }
    }

    animationFrameId.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [rotationVelocity, isTouching, rotationY])

  // 優化觸摸處理函數
  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0]
    setIsTouching(true)
    lastTouchX.current = touch.clientX
    lastTimeStamp.current = Date.now()
    // 立即停止當前的慣性動畫
    setRotationVelocity(0)
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
    }
  }

  const handleTouchMove = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    if (!isTouching) return
    
    const touch = event.touches[0]
    const deltaX = touch.clientX - lastTouchX.current
    
    requestAnimationFrame(() => {
      rotationY.set(rotationY.get() + deltaX * 0.5)
    })
    
    lastTouchX.current = touch.clientX
  }, [isTouching, rotationY])

  function handleTouchEnd() {
    setIsTouching(false)
    // 優化慣性效果
    const velocity = rotationVelocity * 0.98 // 輕微降低慣性
    setRotationVelocity(velocity)
  }

  // 修改背景動畫效果
  useEffect(() => {
    const canvas = document.createElement('canvas')
    const container = document.getElementById('background-container')
    if (!container) return
    
    container.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // Matrix rain effect
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%"
    const matrixChars = matrix.split("")
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops = Array(Math.floor(columns)).fill(1)
    
    let animationFrameId: number
    
    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#0F0'
      ctx.font = `${fontSize}px monospace`
      
      drops.forEach((drop, i) => {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)]
        const x = i * fontSize
        const y = drop * fontSize
        
        ctx.fillText(char, x, y)
        
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      })
      
      animationFrameId = requestAnimationFrame(drawMatrix)
    }
    
    drawMatrix()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
      container.removeChild(canvas)
    }
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background container */}
      <div 
        id="background-container" 
        className="fixed inset-0 z-0"
        style={{ 
          background: 'linear-gradient(to bottom, #000000, #1a0000)' 
        }} 
      />
      
      {/* Content container */}
      <div className="relative z-10">
        {/* Header Section */}
        <header className="pt-6 pb-16 sm:pb-24">
          <div className="cyber-card flex justify-between items-center p-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="cyber-text text-3xl md:text-4xl font-bold"
            >
              <span className="bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 text-transparent bg-clip-text">
                NFT_紅包.exe
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                onClick={() => setIsModalOpen(true)}
                className="cyber-button"
                aria-label="創建 NFT 紅包"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                MINT_紅包.NFT
              </Button>
            </motion.div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-16 sm:py-24">
          <div className="absolute inset-0 cyber-grid opacity-20" />
          <div className="relative z-10 flex flex-col items-center">
            {/* 全息投影效果 */}
            <div className="absolute inset-0 hologram-grid" />
            
            {/* 紅包3D效果 */}
            <motion.div
              className="red-packet-cyber group"
              style={{
                rotateY: rotationY,
                transformStyle: "preserve-3d",
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ 
                type: "spring",
                stiffness: 400, // 增加彈簧剛性
                damping: 30,    // 調整阻尼
                mass: 0.8      // 降低質量以提高響應速度
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* 正面 */}
              <motion.div 
                className="absolute inset-0 backface-hidden"
                transition={{ 
                  duration: 0.2 // 減少過渡時間
                }}
              >
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 cyber-gradient" />
                  <div className="absolute inset-[2px] rounded-2xl bg-gradient-to-br from-red-600 to-red-800">
                    {/* 福字容器 */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-40 h-40">
                      <div className="hologram-circle">
                        <span className="matrix-text text-7xl font-bold transform hover:scale-110 transition-transform">福</span>
                      </div>
                    </div>
                    
                    {/* 提示文字 */}
                    <div className="absolute bottom-12 inset-x-0 text-center">
                      <motion.span 
                        className="inline-block cyber-text-glow px-6 py-3"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        TAP_TO_OPEN.exe
                      </motion.span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 背面 */}
              <motion.div 
                className="absolute inset-0 backface-hidden"
                style={{ rotateY: '180deg' }}
                transition={{ 
                  duration: 0.2 // 減少過渡時間
                }}
              >
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 cyber-gradient-alt" />
                  <div className="absolute inset-[2px] rounded-2xl bg-gradient-to-br from-red-800 to-red-950">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="text-center"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="cyber-text-glow text-2xl block mb-4">NFT_LOADED</span>
                        <span className="matrix-text text-sm block">INITIALIZING...</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 sm:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {inView && (
                <>
                  {[
                    { 
                      text: 'MINT.exe', 
                      icon: Code2,
                      description: '鑄造你的專屬NFT紅包'
                    },
                    { 
                      text: 'SHARE.sys', 
                      icon: Share2,
                      description: '分享給親朋好友'
                    },
                    { 
                      text: 'CLAIM.bat', 
                      icon: Coins,
                      description: '領取並收藏NFT資產'
                    }
                  ].map(({ text, icon: Icon, description }, index) => (
                    <motion.div
                      key={text}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      className="cyber-card-alt group"
                    >
                      <div className="relative p-8 bg-gradient-to-br from-red-950/50 to-black/50 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
                        <Icon className="cyber-icon w-12 h-12 mb-6 text-red-500 group-hover:text-red-400 transition-colors" />
                        <h3 className="cyber-text text-xl mb-4 text-red-500/90">{text}</h3>
                        <p className="text-sm text-gray-400 font-mono">{description}</p>
                        <div className="absolute -inset-px bg-gradient-to-r from-red-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10" />
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="cyber-modal max-w-md mx-auto bg-black/95 border border-red-500/30 backdrop-blur-xl">
          <DialogHeader className="space-y-4">
            <DialogTitle className="cyber-modal-title text-2xl font-mono text-red-500">
              CREATE_NFT_紅包.exe
            </DialogTitle>
            <DialogDescription className="cyber-modal-description font-mono text-gray-400">
              INITIALIZE_PARAMETERS...
            </DialogDescription>
          </DialogHeader>
          
          <div className="cyber-form space-y-6 py-4">
            <div className="cyber-input-group space-y-2">
              <Label htmlFor="email" className="cyber-label text-sm font-mono text-red-500/80">
                EMAIL.cfg
              </Label>
              <Input 
                id="email" 
                type="email" 
                className="cyber-input bg-black/50 border-red-500/30 focus:border-red-500/60 text-red-500" 
                placeholder="ENTER_EMAIL.txt" 
              />
            </div>
            <div className="cyber-input-group space-y-2">
              <Label htmlFor="wallet" className="cyber-label text-sm font-mono text-red-500/80">
                WALLET.dat
              </Label>
              <Input 
                id="wallet" 
                className="cyber-input bg-black/50 border-red-500/30 focus:border-red-500/60 text-red-500" 
                placeholder="ENTER_WALLET_ADDRESS.hex" 
              />
            </div>
          </div>
          
          <Button 
            onClick={() => setIsModalOpen(false)} 
            className="cyber-submit-button w-full mt-6 bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-red-500 font-mono"
          >
            EXECUTE_MINT.exe
          </Button>
        </DialogContent>
      </Dialog>

      {/* 固定的底部導航欄 */}
      <nav className="fixed bottom-0 left-0 right-0 w-full h-20 bg-black/90 backdrop-blur-xl border-t border-red-500/20 z-50">
        <div className="max-w-md mx-auto px-4 h-full flex items-center justify-between relative">
          {/* 發送記錄按鈕 */}
          <button className="cyber-nav-button group relative">
            <div className="flex flex-col items-center">
              <History className="w-6 h-6 mb-1 text-red-500 group-hover:text-red-400 transition-colors" />
              <span className="text-xs font-mono text-red-500/80 group-hover:text-red-400/80">
                HISTORY.log
              </span>
            </div>
            <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity" />
          </button>

          {/* 發送紅包按鈕 - 中間突出 */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="cyber-nav-button-primary -mt-6 relative group"
          >
            <div className="relative">
              {/* 發光效果背景 */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-yellow-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity" />
              {/* 按鈕主體 */}
              <div className="relative bg-gradient-to-br from-red-600 to-red-800 p-4 rounded-full border border-red-500/50 shadow-lg shadow-red-500/20">
                <Gift className="w-8 h-8 text-red-100" />
              </div>
            </div>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-red-500/80 group-hover:text-red-400/80 whitespace-nowrap">
              SEND.exe
            </span>
          </button>

          {/* 錢包按鈕 */}
          <button className="cyber-nav-button group relative">
            <div className="flex flex-col items-center">
              <User className="w-6 h-6 mb-1 text-red-500 group-hover:text-red-400 transition-colors" />
              <span className="text-xs font-mono text-red-500/80 group-hover:text-red-400/80">
                WALLET.dat
              </span>
            </div>
            <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity" />
          </button>
        </div>
      </nav>
    </div>
  )
}