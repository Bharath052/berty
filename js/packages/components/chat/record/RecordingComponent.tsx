import React from 'react'
import { Animated, Text, TouchableOpacity, View } from 'react-native'
import { useStyles } from '@berty-tech/styles'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { Icon } from '@ui-kitten/components'
import { RecordingState } from './RecordComponent'

export const RecordingComponent: React.FC<{
	recordingState: RecordingState
	recordingColorVal: Animated.Value
	setRecordingState: React.Dispatch<React.SetStateAction<RecordingState>>
	setHelpMessageValue: ({ message, delay }: { message: string; delay?: number | undefined }) => void
	timer: number
}> = ({ recordingState, recordingColorVal, setRecordingState, setHelpMessageValue, timer }) => {
	const [{ border, padding, margin, color }, { scaleSize }] = useStyles()
	const { t } = useTranslation()

	return (
		<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
			<View
				style={[
					margin.left.medium,
					margin.right.tiny,
					{
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
						alignSelf: 'center',
						height: 40,
						flex: 1,
					},
				]}
			>
				<View
					style={[
						{
							backgroundColor: color.red,
							position: 'absolute',
							right: 0,
							left: 0,
							top: 0,
							bottom: 0,
							justifyContent: 'center',
						},
						padding.horizontal.small,
						border.radius.small,
						margin.right.small,
					]}
				>
					<Text style={{ color: color.white }}>{moment.utc(timer).format('mm:ss')}</Text>
				</View>
				<Animated.View
					style={[
						{
							backgroundColor: color.white,
							position: 'absolute',
							right: 0,
							left: 0,
							top: 0,
							bottom: 0,
							opacity: recordingColorVal.interpolate({
								inputRange: [0, 1],
								outputRange: [0, 0.2],
							}),
						},
						border.radius.small,
						margin.right.small,
					]}
				/>
				<TouchableOpacity
					onPress={() => {
						if (recordingState === RecordingState.RECORDING_LOCKED) {
							setHelpMessageValue({
								message: t('audio.record.tooltip.not-sent'),
							})
							setRecordingState(RecordingState.PENDING_CANCEL)
						}
					}}
					style={[
						border.radius.small,
						{
							alignItems: 'center',
							justifyContent: 'center',
							bottom: 0,
							top: 0,
							position: 'absolute',
						},
					]}
				>
					{recordingState !== RecordingState.RECORDING_LOCKED ? (
						<Text
							style={{
								color: color.black,
								fontWeight: 'bold',
								fontFamily: 'Open Sans',
								padding: 5,
							}}
						>
							{t('audio.record.slide-to-cancel')}
						</Text>
					) : (
						<Text
							style={{
								color: color.black,
								fontWeight: 'bold',
								fontFamily: 'Open Sans',
								padding: 5,
							}}
						>
							{t('audio.record.cancel-button')}
						</Text>
					)}
				</TouchableOpacity>
				{recordingState === RecordingState.RECORDING_LOCKED && (
					<TouchableOpacity
						style={{
							marginRight: 10 * scaleSize,
							paddingHorizontal: 12 * scaleSize,
							justifyContent: 'center',
							alignItems: 'center',
							borderRadius: 100,
							position: 'absolute',
							bottom: 0,
							top: 0,
							right: 0,
						}}
						onPress={() => {
							setRecordingState(RecordingState.PENDING_PREVIEW)
						}}
					>
						<Icon name='square' height={20 * scaleSize} width={20 * scaleSize} fill={color.white} />
					</TouchableOpacity>
				)}
			</View>
			{recordingState === RecordingState.RECORDING_LOCKED && (
				<View
					style={[
						{
							right: 0,
							height: 50,
							justifyContent: 'center',
							alignItems: 'flex-end',
							paddingRight: 15 * scaleSize,
						},
					]}
				>
					<TouchableOpacity
						style={[
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
			)}
		</View>
	)
}
