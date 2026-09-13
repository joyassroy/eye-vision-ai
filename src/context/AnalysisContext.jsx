import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { DEFAULT_CLASSES } from '../constants/defaultClasses.js'
import { getClasses, healthCheck } from '../services/api.js'

const AnalysisContext = createContext(null)

export function AnalysisProvider({ children }) {
  const [classes, setClasses] = useState(DEFAULT_CLASSES)
  const [backendStatus, setBackendStatus] = useState('checking')
  const [currentFile, setCurrentFile] = useState(null)
  const [currentFileName, setCurrentFileName] = useState('')
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState('')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analysisThreshold, setAnalysisThreshold] = useState(0.5)
  const [loading, setLoading] = useState(false)
  const previewUrlRef = useRef('')

  useEffect(() => {
    let mounted = true

    const checkBackend = () => {
      healthCheck()
        .then(() => {
          if (mounted) {
            setBackendStatus('online')
          }
        })
        .catch(() => {
          if (mounted) {
            setBackendStatus('offline')
          }
        })
    }

    checkBackend()

    getClasses()
      .then((response) => {
        if (mounted && Array.isArray(response.classes) && response.classes.length > 0) {
          setClasses(response.classes)
        }
      })
      .catch(() => {
        if (mounted) {
          setClasses(DEFAULT_CLASSES)
        }
      })

    const intervalId = window.setInterval(checkBackend, 5000)

    return () => {
      mounted = false
      window.clearInterval(intervalId)
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
      }
    }
  }, [])

  function setCurrentImage(file) {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
    }

    const nextUrl = URL.createObjectURL(file)
    previewUrlRef.current = nextUrl
    setCurrentFile(file)
    setCurrentFileName(file.name)
    setCurrentPreviewUrl(nextUrl)
  }

  function clearCurrentImage() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = ''
    }

    setCurrentFile(null)
    setCurrentFileName('')
    setCurrentPreviewUrl('')
  }

  const value = {
    classes,
    backendStatus,
    currentFile,
    currentFileName,
    currentPreviewUrl,
    analysisResult,
    analysisThreshold,
    loading,
    setCurrentImage,
    clearCurrentImage,
    setAnalysisResult,
    setAnalysisThreshold,
    setLoading,
  }

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>
}

export function useAnalysis() {
  const context = useContext(AnalysisContext)
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider')
  }

  return context
}