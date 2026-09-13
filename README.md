---
title: Eye Vision AI
emoji: 👁️
colorFrom: blue
colorTo: indigo
sdk: gradio
sdk_version: 5.0.1
app_file: app.py
pinned: false
---

# EyeVision AI: Multi-Label Ocular Lesion Detection System

EyeVision AI is a highly optimized, automated deep learning system designed for the simultaneous detection of 15 different anterior segment eye diseases from slit-lamp images. This project was developed as a Final Year Design Project at Daffodil International University by Dipta Acharjee and Joyassroy Barua.

## 🌟 Overview

Ocular diseases are a leading cause of visual impairment globally. Traditional diagnostic models often focus on single-disease classification, failing to address real-world clinical scenarios where patients present with multiple co-occurring eye conditions. 

EyeVision AI bridges this gap by offering an advanced **multi-label classification system** capable of detecting 15 ocular lesions concurrently, including Cataracts, Keratitis, Corneal Tumors, and more, directly from slit-lamp imagery.

## 🚀 Key Features

*   **Multi-Label Detection:** Simultaneously predicts the presence or absence of 15 different ocular conditions.
*   **Highly Optimized Architecture:** Built on the parameter-efficient **EfficientNet-V2-M** backbone utilizing transfer learning (ImageNet pre-trained weights).
*   **Explainable AI (XAI):** Integrates **Grad-CAM** (Gradient-weighted Class Activation Mapping) to generate visual heatmaps, providing clinicians with clear, interpretable diagnostic logic.
*   **Advanced Hyperparameter Tuning:** Employs Bayesian Optimization via the **Optuna** framework to dynamically optimize learning rates, batch sizes, dropout, and weight decay.
*   **Robust Data Pipeline:** Utilizes iterative multilabel stratification for balanced dataset splitting and aggressive dynamic data augmentation (random rotations, affine transformations, color jittering) to prevent overfitting.
*   **Full-Stack Implementation:** Includes a PyTorch/FastAPI backend for model inference and a modern, premium React/Vite frontend for a seamless user experience.

## 📊 Dataset and Preprocessing

The system was trained on a clinical dataset of **2,617 high-resolution slit-lamp photographs**.
*   **Class Imbalance Handling:** The dataset exhibited extreme long-tail class imbalance. This was addressed using `MultiLabelBinarizer` and `MultilabelStratifiedShuffleSplit` (from the `iterative-stratification` library) to ensure proportional representation across Training (70%), Validation (15%), and Testing (15%) subsets.
*   **Augmentation:** Training data underwent stochastic transformations including random rotations (up to 10°), affine translations, and color jittering.

## 🧠 Model Architecture & Training

*   **Backbone:** `EfficientNet-V2-M` (frozen feature extractor).
*   **Classification Head:** Custom dropout-controlled linear layer (dimension 1280 to 15).
*   **Loss Function:** `BCEWithLogitsLoss` (Binary Cross-Entropy with Logits) — specifically chosen for numerically stable, independent binary classification across 15 labels.
*   **Optimizer:** Adam.
*   **Hardware:** Trained using cloud-based NVIDIA Tesla T4 GPUs.

## 🏆 Performance Results

The optimized model demonstrated exceptional clinical-grade accuracy, significantly outperforming baseline architectures like ResNet50 and DenseNet121:

*   **Test Loss:** 0.0910
*   **Element-Wise Accuracy:** 96.62%
*   **Macro F1-Score:** 69.56%
*   **Computational Efficiency:** Highly optimized inference time suitable for real-time clinical triage.

*(Note: The model achieved near 1.0 AUC scores for critical conditions like Keratitis and Corneal Dystrophy).*

## 👨‍💻 Authors

*   **Joyassroy Barua** (ID: 0242220005101616) — ML Engineer & Backend Developer
*   **Dipta Acharjee** (ID: 0242220005101603) — Full Stack Developer & Researcher

**Supervision:**
*   Abdullah Al Kafi (Lecturer, CSE, DIU)
*   Mst. Umme Ayman (Senior Lecturer, CSE, DIU)

## ⚠️ Disclaimer
This system is a research prototype developed for educational and experimental purposes. It is not intended to replace professional medical diagnosis or ophthalmological consultation.
