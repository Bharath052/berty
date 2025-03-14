import React, { useMemo, useState } from 'react'
import { useStyles } from '@berty-tech/styles'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'
import { Icon } from '@ui-kitten/components'
import { readFile } from 'react-native-fs'
import { playSoundFile } from '@berty-tech/store/sounds'
import { WaveForm } from '@berty-tech/components/chat/message/AudioMessage'
import {
	limitIntensities,
	RecordingState,
	volumeValuesAttached,
	volumeValueLowest,
	volumeValuePrecision,
} from '@berty-tech/components/chat/record/RecordComponent'

export const PreviewComponent: React.FC<{
	meteredValuesRef: React.MutableRefObject<number[]>
	recordDuration: number | null
	recordFilePath: string
	clearRecordingInterval: ReturnType<typeof setInterval> | null
	setRecordingState: React.Dispatch<React.SetStateAction<RecordingState>>
	setHelpMessageValue: ({ message, delay }: { message: string; delay?: number | undefined }) => void
}> = ({
	meteredValuesRef,
	recordDuration,
	recordFilePath,
	clearRecordingInterval,
	setRecordingState,
	setHelpMessageValue,
}) => {
	const [{ border, padding, margin, color }, { scaleSize }] = useStyles()
	const { t } = useTranslation()
	const [player, setPlayer] = useState<any>(null)
	const isPlaying = useMemo(() => player?.isPlaying === true, [player?.isPlaying])

	return (
		<View
			style={[{ flex: 1, flexDirection: 'row', alignItems: 'center' }, margin.horizontal.medium]}
		>
			<TouchableOpacity
				style={[
					padding.horizontal.small,
					margin.right.small,
					{
						alignItems: 'center',
						justifyContent: 'center',
						width: 36 * scaleSize,
						height: 36 * scaleSize,
						backgroundColor: color.red,
						borderRadius: 18,
					},
				]}
				onPress={() => {
					clearInterval(clearRecordingInterval)
					setHelpMessageValue({
						message: t('audio.record.tooltip.not-sent'),
					})
					setRecordingState(RecordingState.PENDING_CANCEL)
				}}
			>
				<Icon
					name='trash-outline'
					height={20 * scaleSize}
					width={20 * scaleSize}
					fill={color.white}
				/>
			</TouchableOpacity>
			<View
				style={[
					border.radius.medium,
					margin.right.small,
					padding.left.small,
					{
						height: 50,
						flex: 1,
						backgroundColor: '#F7F8FF',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
					},
				]}
			>
				<View
					style={[
						{
							height: '100%',
							flex: 1,
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
						},
					]}
				>
					<TouchableOpacity
						onPress={() => {
							if (player?.isPlaying) {
								player?.pause()
							} else if (player?.isPaused) {
								player?.playPause()
							} else {
								readFile(recordFilePath, 'base64')
									.then((response) => {
										console.log('SUCCESS')
										setPlayer(playSoundFile(response))
									})
									.catch((err) => {
										console.error(err)
									})
							}
						}}
					>
						<Icon
							name={isPlaying ? 'pause' : 'play'}
							fill='#4F58C0'
							height={18 * scaleSize}
							width={18 * scaleSize}
							pack='custom'
						/>
					</TouchableOpacity>
					<WaveForm
						intensities={limitIntensities(
							meteredValuesRef.current.map((v) =>
								Math.round((v - volumeValueLowest) * volumeValuePrecision),
							),
							volumeValuesAttached,
						)}
						currentTime={isPlaying && player?.currentTime}
						duration={recordDuration}
					/>
				</View>
			</View>
			<TouchableOpacity
				style={[
					padding.horizontal.small,
					{
						alignItems: 'center',
						justifyContent: 'center',
						width: 36 * scaleSize,
						height: 36 * scaleSize,
						backgroundColor: color.blue,
						borderRadius: 18,
					},
				]}
				onPress={() => {
					setRecordingState(RecordingState.COMPLETE)
				}}
			>
				<Icon
					name='paper-plane-outline'
					width={20 * scaleSize}
					height={20 * scaleSize}
					fill={color.white}
				/>
			</TouchableOpacity>
		</View>
	)
}
